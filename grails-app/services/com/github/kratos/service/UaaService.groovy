package com.github.kratos.service

import groovyx.net.http.HTTPBuilder
import org.springframework.beans.factory.annotation.Value

import static groovyx.net.http.ContentType.URLENC

class UaaService {

    static transactional = false

    @Value('${kratos.cloudfoundry.api.url}')
    private String baseApiUrl

    def getAccessToken(username, password) {
        def login = new HTTPBuilder(getAuthorizationEndpoint());
        def headers = [authorization: 'Basic Y2Y6']
        def request = [grant_type: 'password', username: username, password: password]
        def response = login.post(path: '/oauth/token', headers: headers, body: request, requestContentType: URLENC)
        response.token_type + ' ' + response.access_token
    }

    def getAuthorizationEndpoint() {
        def api = new HTTPBuilder(baseApiUrl)
        def info = api.get(path: '/v2/info')
        info.authorization_endpoint
    }

}