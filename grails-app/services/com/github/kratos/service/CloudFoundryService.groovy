package com.github.kratos.service

import groovyx.net.http.HTTPBuilder
import org.springframework.beans.factory.InitializingBean
import org.springframework.beans.factory.annotation.Value

class CloudFoundryService implements InitializingBean {

    @Value('${kratos.cloudfoundry.api.url}')
    def baseApiUrl

    def api

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
        def organization = [id:cfOrganization.metadata.guid, name: cfOrganization.entity.name, quotaId:  cfOrganization.entity.quota_definition_guid, users:[], spaces:[]]
        for(cfSpace in cfOrganization.entity.spaces){
            def space = [id:cfSpace.metadata.guid, name: cfSpace.entity.name, apps:[]]
            for(cfApp in cfSpace.entity.apps){
                space.apps.add([id:cfApp.metadata.guid, name:cfApp.entity.name])
            }
            organization.spaces.add(space)
        }
        for(cfUser in cfOrganization.entity.users){
            organization.users.add([id:cfUser.metadata.guid])
        }
        return organization
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

        def buildpack = (cfApplication.entity.buildpack == null) ? cfApplication.entity.buildpack : cfApplication.entity.detected_buildpack

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
