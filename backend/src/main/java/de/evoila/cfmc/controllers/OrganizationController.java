/**
 * 
 */
package de.evoila.cfmc.controllers;


import java.util.List;

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
import org.springframework.web.client.RestTemplate;

import de.evoila.cfmc.api.model.Organization;
import de.evoila.cfmc.api.model.base.CloudFoundryResource;
import de.evoila.cfmc.api.model.base.CloudFoundryResources;
import de.evoila.cfmc.api.repositories.RestRepository;
import de.evoila.cfmc.api.repositories.UserRepository;


/**
 * 
 * @author Johannes Hiemer.
 *
 */
@RestController
@RequestMapping(value = "/api")
public class OrganizationController {
	
	@Autowired
    private RestRepository restRepository;
	
	@Autowired
    protected RestTemplate restTemplate;
	
	@Autowired
    private UserRepository userRepository;
	
	private static final String V2_ORGANIZATIONS = "v2/organizations";
	
	
	@RequestMapping(value = "/organizations", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Organization>> getOrganizations(@RequestHeader("Authorization") final String token) {
		CloudFoundryResources<Organization> organizations = restRepository.list(token, V2_ORGANIZATIONS, 1, true);
		return organizations.getResources();
    }
		
	@RequestMapping(value = "/organizations/{id}", method = RequestMethod.GET)
    public @ResponseBody CloudFoundryResource<Organization> getOrganization(@RequestHeader("Authorization") String token, 
    		@PathVariable("id") final String id) {
		CloudFoundryResource<Organization> organization = restRepository.one(token, V2_ORGANIZATIONS, id, 1);
		return organization;
    }
	
	/*
	 * requires admin token (user registration)
	 */
	@RequestMapping(value = "/organization/{orgName}", method = RequestMethod.GET)
    public @ResponseBody boolean checkIfOrganizationNameExists(@PathVariable("orgName") final String orgName) {
		boolean nameExists = false;
		String adminToken = userRepository.login();		
		CloudFoundryResources<Organization> organizations = restRepository.list(adminToken, V2_ORGANIZATIONS.concat("?q=name:").concat(orgName.toLowerCase()), 2, false);
		if(organizations.getTotalResults() > 0)
			nameExists = true;
		
		return nameExists;
    }
	/*
	 * requires admin token (user registration)
	 */
	@RequestMapping(value = "/organizations", method = RequestMethod.POST)
    public @ResponseBody CloudFoundryResource<Organization> createOrganization(@RequestBody Organization organization) {
		String adminToken = userRepository.login();		
		return restRepository.save(adminToken, V2_ORGANIZATIONS, new CloudFoundryResource<Organization>(organization));
    }
    
    @RequestMapping(value = "/organizations/{id}", method = RequestMethod.PUT)
    public @ResponseBody CloudFoundryResource<Organization> updateOrganization(@RequestHeader("Authorization") String token, 
    		@PathVariable("id") String id, @RequestBody CloudFoundryResource<Organization> organization) {	
    	return restRepository.update(token, V2_ORGANIZATIONS.concat("/").concat(id), organization);
    }

    @RequestMapping(value = "/organizations/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteOrganizationById(@RequestHeader("Authorization") final String token, @PathVariable("id") final String id) {
        restRepository.delete(token, V2_ORGANIZATIONS, id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
