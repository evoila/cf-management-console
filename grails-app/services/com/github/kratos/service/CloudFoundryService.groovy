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
        def headers = [authorization: token]
        def response = api.get(path: '/v2/apps/'.concat(id), headers: headers, query: ['inline-relations-depth':'2'])

        def buildpack = response.entity.buildpack ? response.entity.buildpack : response.entity.detected.buildpack

        def urls = []
        for (route in response.entity.routes) {
            def host = route.entity.host
            def domain = route.entity.domain.entity.name
            urls.add(host.concat('.').concat(domain))
        }

        [id: response.metadata.guid,
                name: response.entity.name,
                memory: response.entity.memory,
                diskQuota: response.entity.disk_quota,
                state: response.entity.state,
                buildpack: buildpack,
                urls: urls]
    }

}
