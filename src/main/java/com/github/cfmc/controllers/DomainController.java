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

import com.github.cfmc.api.model.Domain;
import com.github.cfmc.api.model.base.CloudFoundryResource;
import com.github.cfmc.api.model.base.CloudFoundryResources;
import com.github.cfmc.api.repositories.RestRepository;
import com.github.cfmc.api.repositories.UserRepository;

/**
 * 
 * @author Tobias Siegl.
 *
 */

@Controller
@RequestMapping(value = "/api")
public class DomainController {

	@Autowired
    private UserRepository userRepository;
	
	@Autowired
    private RestRepository restRepository;
	
	private static final String V2_ORGANIZATIONS = "v2/organizations/";
	private static final String V2_PRIVATE_DOMAINS = "v2/private_domains";
	
	@RequestMapping(value = "/private_domains/{orgId}", method = RequestMethod.GET)
	public @ResponseBody List<CloudFoundryResource<Domain>> getPrivateDomainsForOrganization(@PathVariable("orgId") final String orgId) {
		String token = userRepository.login();
		CloudFoundryResources<Domain> privateDomains = restRepository.list(token, V2_ORGANIZATIONS.concat(orgId).concat("/private_domains"), 2, true);
    	return privateDomains.getResources();
	}
	
	@RequestMapping(value = "/private_domains", method = RequestMethod.POST)
    public @ResponseBody CloudFoundryResource<Domain> createPrivateDomainForOrganization(@RequestHeader("Authorization") String token, 
    		@RequestBody Domain domain) {
        return restRepository.save(token, V2_PRIVATE_DOMAINS, new CloudFoundryResource<Domain>(domain));
    }
	
	@RequestMapping(value = "/private_domains/{domainId}", method = RequestMethod.DELETE)
    public void deletePrivateDomain(@PathVariable("domainId") final String domainId) {
		String token = userRepository.login();
    	restRepository.delete(token, V2_PRIVATE_DOMAINS, domainId);
    }
}
