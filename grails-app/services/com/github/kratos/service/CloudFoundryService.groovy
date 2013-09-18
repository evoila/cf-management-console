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

    def getApplication(token, id) {
        def response = api.get(path: '/v2/apps/'.concat(id), headers: [authorization: token], query: ['inline-relations-depth':'3'])

        def buildpack = response.entity.buildpack ? response.entity.buildpack : response.entity.detected.buildpack

        def urls = []
        for (route in response.entity.routes) {
            def host = route.entity.host
            def domain = route.entity.domain.entity.name
            urls.add(host.concat('.').concat(domain))
        }

        def serviceBindings = []
        for (binding in response.entity.service_bindings) {
            def plan = binding.entity.service_instance.entity.service_plan
            def servicePlan = [id: plan.metadata.guid, name: plan.entity.name, description: plan.entity.description]

            def instance = binding.entity.service_instance
            def serviceInstance = [id: instance.metadata.guid, name: instance.entity.name, servicePlan: servicePlan]

            serviceBindings.add([id: binding.metadata.guid, serviceInstance: serviceInstance])
        }

        [id: response.metadata.guid, name: response.entity.name, memory: response.entity.memory, diskQuota: response.entity.disk_quota,
                state: response.entity.state, buildpack: buildpack, urls: urls, serviceBindings: serviceBindings]
    }

}
