package com.github.kratos.service

import groovyx.net.http.HTTPBuilder
import org.springframework.beans.factory.InitializingBean
import org.springframework.beans.factory.annotation.Value

import static groovyx.net.http.ContentType.URLENC

class UaaService implements InitializingBean {

    @Value('${kratos.cloudfoundry.api.url}')
    def baseApiUrl
    @Value('${kratos.cloudfoundry.uaa.url}')
    def baseUaaUrl
    @Value('${kratos.cloudfoundry.token.id}')
    def applicationId
    @Value('${kratos.cloudfoundry.token.secret}')
    def applicationSecret
    def api
    def uaa

    @Override
    void afterPropertiesSet() throws Exception {
        api = new HTTPBuilder(baseApiUrl)
        uaa = new HTTPBuilder(baseUaaUrl)
    }

    def applicationToken() {
        def login = new HTTPBuilder(getAuthorizationEndpoint())
        def body = [grant_type: 'client_credentials', response_type: 'token']
        def headers = [authorization: 'Basic '.concat(applicationId.concat(':').concat(applicationSecret).bytes.encodeBase64().toString()), accept: 'application/json']
        def response = login.post(path: '/oauth/token', headers: headers, body: body, requestContentType: URLENC)
        return response.token_type.concat(' ').concat(response.access_token)
    }

    def userDetails(token) {
        def uaa = new HTTPBuilder(baseUaaUrl)
        def userDetails = uaa.get(path: '/userinfo',
                headers: [authorization: token, accept: 'application/json'])
        return [id:userDetails.user_id, username: userDetails.user_name, roles:[]]
    }

    def userNames(filter){
        def uaa = new HTTPBuilder(baseUaaUrl)
        return uaa.get(path: '/ids/Users',
                headers: [authorization: applicationToken(), accept: 'application/json'],
                query:[filter : filter])
    }

    def getAccessToken(username, password) {
        def login = new HTTPBuilder(getAuthorizationEndpoint());
        def request = [grant_type: 'password', username: username, password: password]
        def response = login.post(path: '/oauth/token', headers: [authorization: 'Basic Y2Y6'], body: request, requestContentType: URLENC)
        response.token_type + ' ' + response.access_token
    }

    def getAuthorizationEndpoint() {
        def info = api.get(path: '/v2/info')
        info.authorization_endpoint
    }

}