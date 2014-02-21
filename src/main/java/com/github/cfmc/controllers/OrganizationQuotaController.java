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

import com.github.cfmc.api.model.OrganizationQuota;
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
public class OrganizationQuotaController {
	
	@Autowired
    private RestRepository restRepository;
	
	private static final String V2_ORGANIZATIONS_QUOTAS = "v2/quota_definitions";

	@RequestMapping(value = "/organizationQuotas/{id}", method = RequestMethod.GET)
    public @ResponseBody CloudFoundryResource<OrganizationQuota> getOrganization(@RequestHeader("Authorization") String token, @PathVariable("id") final String id) {
		CloudFoundryResource<OrganizationQuota> organizationQuota = restRepository.one(token, V2_ORGANIZATIONS_QUOTAS, id);
        return organizationQuota;
    }

    @RequestMapping(value = "/organizationQuotas", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<OrganizationQuota>> getOrganizations(@RequestHeader("Authorization") final String token) {
        CloudFoundryResources<OrganizationQuota> organizationQuotas = restRepository.apiGetv2(token, V2_ORGANIZATIONS_QUOTAS);
        return organizationQuotas.getResources();
    }
    
    @RequestMapping(value = "/organizationQuotas", method = RequestMethod.POST)
    public @ResponseBody CloudFoundryResource<OrganizationQuota> createOrganization(@RequestHeader("Authorization") String token, 
    		@RequestBody OrganizationQuota organizationQuota) {
    	return restRepository.save(token, V2_ORGANIZATIONS_QUOTAS, new CloudFoundryResource<OrganizationQuota>(organizationQuota));
    }
    
    @RequestMapping(value = "/organizationQuotas/{id}", method = RequestMethod.PUT)
    public @ResponseBody CloudFoundryResource<OrganizationQuota> updateOrganization(@RequestHeader("Authorization") String token, 
    		@PathVariable("id") String id, @RequestBody CloudFoundryResource<OrganizationQuota> organizationQuota) {
       return restRepository.update(token, V2_ORGANIZATIONS_QUOTAS.concat(id), organizationQuota);
    }

    @RequestMapping(value = "/organizationQuotas/{id}", method = RequestMethod.DELETE)
    public void deleteOrganizationById(@RequestHeader("Authorization") final String token, @PathVariable("id") final String id) {
    	restRepository.delete(token, V2_ORGANIZATIONS_QUOTAS, id);
    }

    

    

}
