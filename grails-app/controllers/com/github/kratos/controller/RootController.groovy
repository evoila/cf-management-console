package com.github.kratos.controller

import grails.converters.JSON

class RootController {

    def cloudFoundryService
    def uaaService

    def root() {
        def token = request.getHeader('authorization')
        def organizations = cloudFoundryService.organizations(token)
        def orgId = params.id ? params.id : organizations[0].id
        def organization = cloudFoundryService.organization(token , orgId)
        def userDetails = uaaService.userDetails(token)
        def userNames = uaaService.userNames(userNamesFilter(organization.users))

        for(user in organization.users){
            for(username in userNames.resources){
                if (user.id == username.id){
                    user.username = username.userName
                }
            }
        }

        def root = [user: userDetails, organizations: organizations, organization: organization]



        withFormat {
            json {
                render root as JSON
            }
        }
    }

    def userNamesFilter(users){
        def filter = ''
        def index = 0
        for(user in users){
            filter = filter.concat('id eq \'').concat(user.id).concat('\'')
            if(index < users.size() - 1){
                filter = filter.concat(' or ')
            }
            index++
        }
        return filter
    }
}
