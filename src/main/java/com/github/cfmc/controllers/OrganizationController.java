/**
 * 
 */
package com.github.cfmc.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import com.github.cfmc.api.model.Organization;
import com.github.cfmc.api.model.base.CloudFoundryResource;
import com.github.cfmc.api.model.base.CloudFoundryResources;
import com.github.cfmc.api.repositories.RestRepository;

/**
 * 
 * @author Johannes Hiemer.
 *
 */
@Controller
@RequestMapping(value = "/api")
public class OrganizationController {
	
	@Autowired
    private RestRepository restRepository;
	
	private static final String V2_ORGANIZATIONS = "v2/organizations";
	
	
	@RequestMapping(value = "/organizations", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Organization>> getOrganizations(@RequestHeader("Authorization") final String token) {
		CloudFoundryResources<Organization> organizations = restRepository.list(token, V2_ORGANIZATIONS, 1);
		return organizations.getResources();
    }
		
	@RequestMapping(value = "/organizations/{id}", method = RequestMethod.GET)
    public @ResponseBody CloudFoundryResource<Organization> getOrganization(@RequestHeader("Authorization") String token, @PathVariable("id") final String id) {
		CloudFoundryResource<Organization> organization = restRepository.one(token, V2_ORGANIZATIONS, id, 1);
		return organization;
    }

	@RequestMapping(value = "/organizations", method = RequestMethod.POST)
    public @ResponseBody CloudFoundryResource<Organization> createOrganization(@RequestHeader("Authorization") String token, 
    		@RequestBody Organization organization) {
		return restRepository.save(token, V2_ORGANIZATIONS, new CloudFoundryResource<Organization>(organization));
    }
    
    @RequestMapping(value = "/organizations/{id}", method = RequestMethod.PUT)
    public @ResponseBody CloudFoundryResource<Organization> updateOrganization(@RequestHeader("Authorization") String token, 
    		@PathVariable("id") String id, @RequestBody CloudFoundryResource<Organization> organization) {
    	return restRepository.update(token, V2_ORGANIZATIONS.concat("/").concat(id), organization);
    }

    @RequestMapping(value = "/organizations/{id}", method = RequestMethod.DELETE)
    public void deleteOrganizationById(@RequestHeader("Authorization") final String token, @PathVariable("id") final String id) {
        restRepository.delete(token, V2_ORGANIZATIONS, id);
    }

}
