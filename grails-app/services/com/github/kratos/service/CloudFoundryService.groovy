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

}
