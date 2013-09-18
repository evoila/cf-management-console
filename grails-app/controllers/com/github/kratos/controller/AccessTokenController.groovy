package com.github.kratos.controller

import grails.converters.JSON

class AccessTokenController {

    def uaaService

    def authenticate() {
        def token = uaaService.getAccessToken(params.username, params.password)
        def response = [token: token]
        withFormat {
            json {
                render response as JSON
            }
        }
    }

}