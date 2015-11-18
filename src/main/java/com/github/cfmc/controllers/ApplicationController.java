/**
 * 
 */
package com.github.cfmc.controllers;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.cfmc.api.model.Application;
import com.github.cfmc.api.model.Instance;
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
	
	@Autowired
	private ObjectMapper objectMapper;
	
	private static final String V2_APPS = "v2/apps";
	
	private static final String V2_SERVICE_INSTANCES = "v2/service_instances";

	@RequestMapping(value = "/applications/{id}", method = GET)    
    public @ResponseBody CloudFoundryResource<Application> getApplicationById(@RequestHeader("Authorization") String token, 
    		@PathVariable("id") String id) {
		CloudFoundryResource<Application> application = restRepository.one(token, V2_APPS, id, 1);
        return application;
    }
	
	@RequestMapping(value = "/applications/{id}", method = RequestMethod.PUT)
    public Application updateApplication(@RequestHeader("Authorization") String token, 
    		@PathVariable("id") String id, @RequestBody CloudFoundryResource<Application> application) {
		return restRepository.update(token, V2_APPS.concat("/").concat(id), application).getEntity();
    }
	
	@RequestMapping(value = "/applications/{id}/instances", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Instance>> getApplicationInstances(@RequestHeader("Authorization") String token, 
    		@PathVariable("id") String id) {
		
		Map<String, Object> values = restRepository.customList(token, V2_APPS.concat("/").concat(id).concat("/instances"), 1);
		List<CloudFoundryResource<Instance>> instances = new ArrayList<>(); 
		for (Object value : values.values()) {
			instances.add(new CloudFoundryResource<Instance>(objectMapper.convertValue(value, Instance.class)));
		}
		return instances;
    }
	
	@RequestMapping(value = "/applications/{id}/bindings/{bindingId}", method = RequestMethod.GET)
    public @ResponseBody CloudFoundryResource<Instance> getApplicationInstances(@RequestHeader("Authorization") String token, 
    		@PathVariable("id") String id, @PathVariable("bindingId") String bindingId) {
		
		CloudFoundryResource<Instance> instance = restRepository.one(token, V2_SERVICE_INSTANCES, bindingId, 1);
		
		return instance;
    }
	 
	@RequestMapping(value = "/applications/{id}", method = RequestMethod.DELETE)
    public void deleteApplicationById(@RequestHeader("Authorization") final String token, 
    		@PathVariable("id") final String id) {
    	restRepository.delete(token, V2_APPS, id);
    }

    @RequestMapping(value = "/applications/{id}/instances/{instance}/logs/{logName}", method = GET)
    public @ResponseBody String getApplicationInstanceLog(@RequestHeader("Authorization") final String token,
    		@PathVariable("id") String id, @PathVariable("instance") String instance,
    		@PathVariable("logName") String logName) {
    	String path = V2_APPS.concat("/").concat(id).concat("/instances/").concat(instance)
    			.concat("/files/logs/").concat(logName).concat(".log");
    	String log = restRepository.customOne(token, path, new ParameterizedTypeReference<String>() {});
    	
    	return log;
    }

}
