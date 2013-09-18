package com.github.kratos.service

import org.springframework.beans.factory.annotation.Value

class CloudFoundryService {

    static transactional = false

    @Value('${kratos.cloudfoundry.uaa.url}')
    private String baseUaaUrl

    @Value('${kratos.cloudfoundry.api.url}')
    private String baseApiUrl



}
