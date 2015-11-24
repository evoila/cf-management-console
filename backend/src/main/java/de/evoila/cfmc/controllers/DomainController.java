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

import de.evoila.cfmc.api.model.Domain;
import de.evoila.cfmc.api.model.base.CloudFoundryResource;
import de.evoila.cfmc.api.model.base.CloudFoundryResources;
import de.evoila.cfmc.api.repositories.RestRepository;
import de.evoila.cfmc.api.repositories.UserRepository;

/**
 * 
 * @author Tobias Siegl.
 *
 */
@RestController
@RequestMapping(value = "/api")
public class DomainController {

	@Autowired
    private UserRepository userRepository;
	
	@Autowired
    private RestRepository restRepository;
	
	private static final String V2_ORGANIZATIONS = "v2/organizations/";
	private static final String V2_PRIVATE_DOMAINS = "v2/private_domains";
	
	
	@RequestMapping(value = "/private_domains/{orgId}", method = RequestMethod.GET)
	public @ResponseBody List<CloudFoundryResource<Domain>> getPrivateDomainsForOrganization(@RequestHeader("Authorization") String token, 
			@PathVariable("orgId") final String orgId) {
		String adminToken = userRepository.login();
		CloudFoundryResources<Domain> privateDomains = restRepository.list(adminToken, V2_ORGANIZATIONS.concat(orgId).concat("/private_domains"), 2, true);
    	return privateDomains.getResources();
	}
	
	@RequestMapping(value = "/private_domains", method = RequestMethod.POST)
    public @ResponseBody CloudFoundryResource<Domain> createPrivateDomainForOrganization(@RequestHeader("Authorization") String token, 
    		@RequestBody Domain domain) {
		String adminToken = userRepository.login();
        return restRepository.save(adminToken, V2_PRIVATE_DOMAINS, new CloudFoundryResource<Domain>(domain));
    }
	
	@RequestMapping(value = "/private_domains/{domainId}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deletePrivateDomain(@RequestHeader("Authorization") String token, @PathVariable("domainId") final String domainId) {
		String adminToken = userRepository.login();
    	restRepository.delete(adminToken, V2_PRIVATE_DOMAINS, domainId);
    	return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
