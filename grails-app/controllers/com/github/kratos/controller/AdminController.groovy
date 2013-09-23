package com.github.kratos.controller

import grails.converters.JSON

class AdminController {

    def cloudFoundryService

    def admin(){
        def token = request.getHeader('authorization')
        def admin = [quotas: cloudFoundryService.quotas(token),
                    organizations: cloudFoundryService.organizations(token)]
        withFormat {
            json {
                render admin as JSON
            }
        }
    }

}
