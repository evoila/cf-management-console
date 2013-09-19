package com.github.kratos.controller

import grails.converters.JSON

class RootController {

    def cloudFoundryService
    def uaaService

    def root() {
        def composeRoot = { token, id ->
            def organizations = cloudFoundryService.organizations(token)
            def organization = cloudFoundryService.organization(token, id ? id : organizations[0].id)
            def userDetails = uaaService.userDetails(token)
            if (cloudFoundryService.isAdmin(userDetails.id)) {
                userDetails.roles.add('ADMIN')
            }
            return [user: userDetails, organizations: organizations, organization: organization]
        }
        withFormat {
            json {
                render composeRoot(request.getHeader('authorization'), params.id) as JSON
            }
        }
    }

}
