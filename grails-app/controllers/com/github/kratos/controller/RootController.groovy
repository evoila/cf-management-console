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

            if (cloudFoundryService.isAdmin(userDetails.id)){
                userDetails.roles.add('ADMIN')
            }

            def quotaDefinition = cfOrganization.entity.quota_definition
            def organization = [id: cfOrganization.metadata.guid,
                    name: cfOrganization.entity.name,
                    quota: [
                            id:quotaDefinition.metadata.guid,
                            username: quotaDefinition.entity.name,
                            services: quotaDefinition.entity.total_services,
                            memoryLimit: quotaDefinition.entity.memory_limit,
                            nonBasicServicesAllowed: quotaDefinition.entity.non_basic_services_allowed,
                            trialDbAllowed: quotaDefinition.entity.trial_db_allowed],
                    users: [],
                    spaces: []]

            for (cfUser in cfOrganization.entity.users) {
                def user = [id: cfUser.metadata.guid, username: '', roles: []]
                if (cfUser.entity.admin){
                    user.roles.add('ADMIN')
                }
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
                    space.apps.add([id: spaceApp.metadata.guid, name: spaceApp.entity.name, memory: spaceApp.entity.memory, state: spaceApp.entity.state])
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
                            def user = [id: cfUser.metadata.guid, roles:[role]]
                            if(cfUser.entity.admin){
                                user.roles.add('ADMIN')
                            }
                            users.add(user)
                        }
                    }
                }) as JSON
            }
        }
    }

}
