package com.github.kratos.controller

import grails.converters.JSON

class RootController {

    def cloudFoundryService
    def uaaService

    def root() {

        def composeRoot = { token, id, fComposeFilter, fAppendRole ->
            def organizations = cloudFoundryService.organizations(token)
            def cfOrganization = cloudFoundryService.organization(token, id ? id : organizations[0].id)
            def userDetails = uaaService.userDetails(token)
            def cfUserNames = uaaService.userNames(fComposeFilter(cfOrganization.entity.users))

            def organization = [id: cfOrganization.metadata.guid, name: cfOrganization.entity.name, quotaId: cfOrganization.entity.quota_definition_guid, users: [], spaces: []]

            for (cfUser in cfOrganization.entity.users) {
                def user = [id: cfUser.metadata.guid, username: '', roles: []]
                for (cfUsername in cfUserNames.resources) {
                    if (user.id == cfUsername.id) {
                        user.username = cfUsername.userName
                    }
                }
                organization.users.add(user)
            }

            def appendOrganizationRole = fAppendRole.curry(organization.users)
            appendOrganizationRole(cfOrganization.entity.managers, 'MANAGER')
            appendOrganizationRole(cfOrganization.entity.auditors, 'AUDITOR')
            appendOrganizationRole(cfOrganization.entity.billing_managers, 'BILLING_MANAGER')

            for (cfSpace in cfOrganization.entity.spaces) {
                def space = [id: cfSpace.metadata.guid, name: cfSpace.entity.name, apps: [], users: []]
                def appendSpaceRole = fAppendRole.curry(space.users);
                for (spaceApp in cfSpace.entity.apps) {
                    space.apps.add([id: spaceApp.metadata.guid, name: spaceApp.entity.name])
                }
                appendSpaceRole(cfSpace.entity.developers, 'DEVELOPER')
                appendSpaceRole(cfSpace.entity.auditors, 'MANAGER')
                appendSpaceRole(cfSpace.entity.managers, 'AUDITOR')
                organization.spaces.add(space)
            }

            return [user: userDetails, organizations: organizations, organization: organization]

        }

        withFormat {
            json {
                render composeRoot(request.getHeader('authorization'), params.id, { cfUsers ->
                    def filter = ''
                    def index = 0
                    for (user in cfUsers) {
                        filter = filter.concat('id eq \'').concat(user.metadata.guid).concat('\'')
                        if (index < cfUsers.size() - 1) {
                            filter = filter.concat(' or ')
                        }
                        index++
                    }
                    return filter
                }, {users, cfUsers, role ->
                    for (cfUser in cfUsers) {
                        def found = false;
                        for (user in users) {
                            if (cfUser.metadata.guid == user.id) {
                                user.roles.add(role)
                                found = true
                                break
                            }
                        }
                        if (!found) {
                            users.add([id: cfUser.metadata.guid, roles:[role]])
                        }
                    }
                }) as JSON
            }
        }
    }

}
