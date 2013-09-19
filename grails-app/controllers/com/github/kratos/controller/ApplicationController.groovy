package com.github.kratos.controller

import grails.converters.JSON

class ApplicationController {

    def cloudFoundryService

    def application() {
        def token = request.getHeader('authorization')

        def availableApplications = cloudFoundryService.applications(token)
        def selectedApplication = cloudFoundryService.application(token, params.id)

        def response = [availableApplications: availableApplications, selectedApplication: selectedApplication]
        withFormat {
            json {
                render response as JSON
            }
        }
    }

}
