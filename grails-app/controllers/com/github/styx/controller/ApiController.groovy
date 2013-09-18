package com.github.styx.controller

import grails.converters.JSON
import grails.converters.XML
import groovyx.net.http.RESTClient

class ApiController {

    def root() {
        /*
        Just a sample controller
         */
        def destinationFinder = new RESTClient('http://www.klm.com/destinations/destination-finder/');
        def result = destinationFinder.get(path: 'cities/AMS', headers: ['Accept': 'application/json'])
        def data = [name: "goran", code: result.data.code]
        withFormat {
            json {
                render data as JSON
            }
        }
    }
}
