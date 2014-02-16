/**
 * 
 */
package com.github.cfmc.controllers;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.cfmc.api.model.Application;
import com.github.cfmc.api.repositories.ApplicationRepository;

/**
 * TODO: Add previous authors.
 * @author Johannes Hiemer
 *
 */
@Controller
@RequestMapping(value = "/api")
public class ApplicationController {

	@Autowired
    private ApplicationRepository applicationRepository;

    @RequestMapping(value = "/applications/{id}", method = RequestMethod.DELETE)
    public void deleteApplicationById(@RequestHeader("Authorization") final String token, 
    		@PathVariable("id") final String id) {
    	
        applicationRepository.deleteById(token, id);
    }

    @RequestMapping(value = "/applications/{id}", method = GET)    
    public @ResponseBody Application getApplicationById(@RequestHeader("Authorization") final String token, 
    		@PathVariable("id") String id) {
        return applicationRepository.getById(token, id);
    }

    @RequestMapping(value = "/applications/{id}/instances/{instance}/logs/{logName}", method = GET)
    public ResponseEntity<String> getApplicationInstanceLog(@RequestHeader("Authorization") final String token,
    		@PathVariable("id") String id, @PathVariable("instance") String instance,
    		@PathVariable("logName") String logName) {
        return applicationRepository.getInstanceLog(token, id, instance, logName);
    }

    @RequestMapping(value = "/applications/{id}", method = RequestMethod.PUT)
    public Application updateApplication(@RequestHeader("Authorization") String token, 
    		@PathVariable("id") String id, @RequestBody String body) {
        return applicationRepository.updateApplication(token, id, body);
    }

}
