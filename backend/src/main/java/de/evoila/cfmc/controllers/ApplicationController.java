/**
 * 
 */
package de.evoila.cfmc.controllers;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import de.evoila.cfmc.api.model.Application;
import de.evoila.cfmc.api.model.Instance;
import de.evoila.cfmc.api.model.base.CloudFoundryResource;
import de.evoila.cfmc.api.model.base.CloudFoundryResources;
import de.evoila.cfmc.api.repositories.RestRepository;

/**
 * 
 * @author Johannes Hiemer
 *
 */
@RestController
@RequestMapping(value = "/api")
public class ApplicationController {
	
	@Autowired
	private RestRepository restRepository;
	
	@Autowired
	private ObjectMapper objectMapper;
	
	private static final String V2_APPS = "v2/apps";
	private static final String V3_APPS = "v3/apps";
	
	private static final String V2_SERVICE_INSTANCES = "v2/service_instances";

	@RequestMapping(value = "/applications/{id}", method = GET)    
    public @ResponseBody CloudFoundryResource<Application> getApplicationById(@RequestHeader("Authorization") String token, 
    		@PathVariable("id") String id) {
		CloudFoundryResource<Application> application = restRepository.one(token, V2_APPS, id, 1);
        return application;
    }
	
	@RequestMapping(value = "/apps/{orgId}", method = RequestMethod.GET)
	public @ResponseBody List<CloudFoundryResource<Application>> getApplicationsForOrganization(@RequestHeader("Authorization") String token,
			@PathVariable("orgId") String orgId) {
		CloudFoundryResources<Application> apps = restRepository.list(token, V2_APPS.concat("?q=organization_guid:").concat(orgId), 1, false);
		return apps.getResources();
	}
	
	@RequestMapping(value = "/applications/{id}", method = RequestMethod.PUT)
    public CloudFoundryResource<Application> updateApplication(@RequestHeader("Authorization") String token, 
    		@PathVariable("id") String id, @RequestBody CloudFoundryResource<Application> application) {
		return restRepository.update(token, V2_APPS.concat("/").concat(id), application);
    }
	
	@RequestMapping(value = "/applications/{id}/start", method = RequestMethod.PUT)
    public Application startApplication(@RequestHeader("Authorization") String token, 
    		@PathVariable("id") String id, @RequestBody CloudFoundryResource<Application> application) {
		return restRepository.update(token, V3_APPS.concat("/").concat(id).concat("/start"), application).getEntity();
    }
	
	@RequestMapping(value = "/applications/{id}/stop", method = RequestMethod.PUT)
    public Application stopApplication(@RequestHeader("Authorization") String token, 
    		@PathVariable("id") String id, @RequestBody CloudFoundryResource<Application> application) {
		return restRepository.update(token, V3_APPS.concat("/guid-").concat(id).concat("/stop"), application).getEntity();
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
    public ResponseEntity<Object> deleteApplicationById(@RequestHeader("Authorization") final String token, 
    		@PathVariable("id") final String id) {
    	restRepository.delete(token, V2_APPS, id);
    	return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
