package com.github.kratos.controller

import grails.converters.JSON
import groovyx.net.http.RESTClient
import org.springframework.beans.factory.annotation.Value

class ApiController {

    def root() {
        /*
        Just a sample controller
         */
        def data = [name: "goran", code: "some code"]
        withFormat {
            json {
                render data as JSON
            }
        }
    }
}
