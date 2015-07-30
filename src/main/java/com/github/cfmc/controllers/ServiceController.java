/**
 * 
 */
package com.github.cfmc.controllers;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.cfmc.api.model.Service;
import com.github.cfmc.api.model.base.CloudFoundryResource;
import com.github.cfmc.api.model.base.CloudFoundryResources;
import com.github.cfmc.api.repositories.RestRepository;

/**
 * 
 * @author Johannes Hiemer.
 *
 */
@Controller
@RequestMapping("/api")
public class ServiceController {

	@Autowired
    private RestRepository restRepository;
	
	private static String V2_SERVICES = "v2/services";

    @RequestMapping(value = "/services", method = GET)
    public @ResponseBody List<CloudFoundryResource<Service>> getServices(@RequestHeader("Authorization") String token) {
        CloudFoundryResources<Service> services = restRepository.list(token, V2_SERVICES, 1);
        return services.getResources();
    }
    
    @RequestMapping(value = "/services", method = RequestMethod.POST)
    public @ResponseBody CloudFoundryResource<Service> createSpace(@RequestHeader("Authorization") String token, 
    		@RequestBody Service service) {
        return restRepository.save(token, V2_SERVICES, new CloudFoundryResource<Service>(service));
    }
    
    @RequestMapping(value = "/services/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteSpaceById(@RequestHeader("Authorization") final String token, @PathVariable("id") final String id) {
    	restRepository.delete(token, V2_SERVICES, id);
    	return new ResponseEntity<>(HttpStatus.OK);
    }

}
