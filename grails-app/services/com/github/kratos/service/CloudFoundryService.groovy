package com.github.kratos.service

import groovyx.net.http.HTTPBuilder
import org.springframework.beans.factory.InitializingBean
import org.springframework.beans.factory.annotation.Value

class CloudFoundryService implements InitializingBean {

    @Value('${kratos.cloudfoundry.api.url}')
    def baseApiUrl

    def api
    def uaaService

    @Override
    void afterPropertiesSet() throws Exception {
        api = new HTTPBuilder(baseApiUrl)
    }

    def organizations(token) {
        def organizations = api.get(path: '/v2/organizations',
                headers: [authorization: token, accept:'application/json'],
                query: ['inline-relations-depth' : '0'])
        def result = []
        for(organization in organizations.resources){
            result.add([id:organization.metadata.guid, name:organization.entity.name, quotaId:organization.entity.quota_definition_guid])
        }
        return result
    }

    def organization(token, id) {
        def cfOrganization = api.get(path: '/v2/organizations/'.concat(id),
                headers: [authorization: token, accept:'application/json'],
                query: ['inline-relations-depth' : '4'])

        def fComposeFilter = { cfUsers ->
            def filter = ''
            cfUsers.each({cfUser ->
                filter = filter.concat("id eq \'${cfUser.metadata.guid}\'")
                filter = (cfUsers.findIndexOf({item -> item.metadata.guid == cfUser.metadata.guid}) < cfUsers.size()-1) ? filter.concat(' or ') : filter
            })
            return filter
        }

        def fAppendRole = { users, cfUsers, role ->
            cfUsers.each({ cfUser ->
                def userExists = users.find {user -> user.id == cfUser.metadata.guid}
                if (userExists) { userExists.roles.add(role)}
                else {
                    users.add([id: cfUser.metadata.guid, roles: [role]])
                    if (cfUser.entity.admin) { users.find({item -> item.id == cfUser.metadata.guid}).roles.add('ADMIN') }
                }
            })
            return users
        }

        def cfUserNames = uaaService.userNames(fComposeFilter(cfOrganization.entity.users))

        def quotaDefinition = cfOrganization.entity.quota_definition
        def organization = [id: cfOrganization.metadata.guid,
                name: cfOrganization.entity.name,
                quota: [
                        id: quotaDefinition.metadata.guid,
                        username: quotaDefinition.entity.name,
                        services: quotaDefinition.entity.total_services,
                        memoryLimit: quotaDefinition.entity.memory_limit,
                        nonBasicServicesAllowed: quotaDefinition.entity.non_basic_services_allowed,
                        trialDbAllowed: quotaDefinition.entity.trial_db_allowed],
                users: [],
                spaces: []]

        for (cfUser in cfOrganization.entity.users) {
            def user = [id: cfUser.metadata.guid, username: '', roles: []]
            if (cfUser.entity.admin) {
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
                def app = [id: spaceApp.metadata.guid, name: spaceApp.entity.name, memory: spaceApp.entity.memory, state: spaceApp.entity.state, urls: []]
                for (route in spaceApp.entity.routes) {
                    app.urls.add("http://$route.entity.host.$route.entity.domain.entity.name")
                }
                space.apps.add(app)
            }
            appendSpaceRole(cfSpace.entity.developers, 'DEVELOPER')
            appendSpaceRole(cfSpace.entity.auditors, 'MANAGER')
            appendSpaceRole(cfSpace.entity.managers, 'AUDITOR')
            organization.spaces.add(space)
        }
        return organization
    }

    def isAdmin(id) {
        def userDetails = api.get(path: '/v2/users/'.concat(id),
                headers: [authorization: uaaService.applicationToken(), accept:'application/json'],
                query: ['inline-relations-depth' : '0'])
        return userDetails.entity.admin
    }


    def applications(token) {
        def response = api.get(path: '/v2/apps', headers: [authorization: token])

        def applications = []
        for (application in response.resources) {
            applications.add([id: application.metadata.guid, name: application.entity.name])
        }
        return applications
    }

    def application(token, id) {
        def cfApplication = api.get(path: '/v2/apps/'.concat(id), headers: [authorization: token], query: ['inline-relations-depth': '3'])
        def cfServices = api.get(path: '/v2/services', headers: [authorization: token])

        def buildpack = ''
        if (cfApplication.entity.buildpack == null) {
            cfApplication.entity.detected_buildpack
        } else {
            cfApplication.entity.buildpack
        }

        def application = [id: cfApplication.metadata.guid, name: cfApplication.entity.name, memory: cfApplication.entity.memory, diskQuota: cfApplication.entity.disk_quota,
                state: cfApplication.entity.state, buildpack: buildpack]

        def urls = []
        for (route in cfApplication.entity.routes) {
            def host = route.entity.host
            def domain = route.entity.domain.entity.name
            urls.add(host.concat('.').concat(domain))
        }
        if (!urls.isEmpty()) {
            application.put('urls', urls)
        }

        def events = []
        for (event in cfApplication.entity.events) {
            events.add([id: event.metadata.guid, status: event.entity.exit_status, description: event.entity.exit_description,
                        timestamp: event.entity.timestamp])
        }
        if (!events.isEmpty()) {
            application.put('events', events)
        }

        def services = []
        for (binding in cfApplication.entity.service_bindings) {
            def plan = binding.entity.service_instance.entity.service_plan
            def servicePlan = [id: plan.metadata.guid, name: plan.entity.name, description: plan.entity.description]

            def serviceType = []
            for (cfService in cfServices.resources) {
                if (cfService.metadata.guid == plan.entity.service_guid) {
                    serviceType = [id: cfService.metadata.guid, name: cfService.entity.label, description: cfService.entity.description,
                            version: cfService.entity.version]
                }
            }

            def instance = binding.entity.service_instance
            services.add([id: instance.metadata.guid, name: instance.entity.name, plan: servicePlan, type: serviceType])
        }
        if (!services.isEmpty()) {
            application.put('services', services)
        }

        return application
    }

}
