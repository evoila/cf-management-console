package com.github.kratos.controller

import grails.converters.JSON

class ApplicationController {

    def cloudFoundryService

    def getApplication() {
        def selectedApplication = cloudFoundryService.getApplication(request.getHeader('authorization'), params.id)
        def response = [selectedApplication: selectedApplication]
        withFormat {
            json {
                render response as JSON
            }
        }
    }

}
