package com.github.kratos.controller

import grails.converters.JSON

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