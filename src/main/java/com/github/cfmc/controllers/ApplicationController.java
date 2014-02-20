/**
 * 
 */
package com.github.cfmc.controllers;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.cfmc.api.model.Application;
import com.github.cfmc.api.model.base.CloudFoundryResource;
import com.github.cfmc.api.repositories.RestRepository;

/**
 * 
 * @author Johannes Hiemer
 *
 */
@Controller
@RequestMapping(value = "/api")
public class ApplicationController {
	
	@Autowired
	private RestRepository restRepository;

	private static final String V2_APPS = "v2/apps";

	@RequestMapping(value = "/applications/{id}", method = GET)    
    public @ResponseBody Application getApplicationById(@RequestHeader("Authorization") final String token, 
    		@PathVariable("id") String id) {
		CloudFoundryResource<Application> application = restRepository.one(token, V2_APPS, id);
        return application.getEntity();
    }
	
	@RequestMapping(value = "/applications/{id}", method = RequestMethod.PUT)
    public Application updateApplication(@RequestHeader("Authorization") String token, 
    		@PathVariable("id") String id, @RequestBody CloudFoundryResource<Application> application) {
		return restRepository.update(token, V2_APPS.concat("/").concat(id), application).getEntity();
    }
	 
	@RequestMapping(value = "/applications/{id}", method = RequestMethod.DELETE)
    public void deleteApplicationById(@RequestHeader("Authorization") final String token, 
    		@PathVariable("id") final String id) {
    	restRepository.delete(token, V2_APPS, id);
    }

    @RequestMapping(value = "/applications/{id}/instances/{instance}/logs/{logName}", method = GET)
    public CloudFoundryResource<String> getApplicationInstanceLog(@RequestHeader("Authorization") final String token,
    		@PathVariable("id") String id, @PathVariable("instance") String instance,
    		@PathVariable("logName") String logName) {
    	String basePath = V2_APPS.concat(id).concat("/instances/").concat(instance);
    	String logPath = "/files/logs/".concat(logName).concat(".log");
    	CloudFoundryResource<String> log = restRepository.one(token, basePath, logPath);
    	
    	return log;
    }

   

}
