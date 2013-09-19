package com.github.kratos.controller

import grails.converters.JSON

class ApplicationController {

    def cloudFoundryService
    def uaaService

    def application() {
        def token = request.getHeader('authorization')

        def userDetails = uaaService.userDetails(token)
        def availableApplications = cloudFoundryService.applications(token)
        def selectedApplication = cloudFoundryService.application(token, params.id)

        def response = [user: userDetails, availableApplications: availableApplications, selectedApplication: selectedApplication]
        withFormat {
            json {
                render response as JSON
            }
        }
    }

}
