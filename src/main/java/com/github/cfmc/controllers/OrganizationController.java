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
import com.github.cfmc.api.repositories.OrganizationRepository;

/**
 * 
 * @author Johannes Hiemer.
 *
 */
@Controller
@RequestMapping(value = "/api")
public class OrganizationController {
	
	@Autowired
    private OrganizationRepository organizationRepository;

    @RequestMapping(value = "/organizations", method = RequestMethod.POST)
    public @ResponseBody String createOrganization(@RequestHeader("Authorization") String token, @RequestBody String body) {
        return organizationRepository.createOrganization(token, body);
    }

    @RequestMapping(value = "/organizations/{id}", method = RequestMethod.DELETE)
    public void deleteOrganizationById(@RequestHeader("Authorization") final String token, @PathVariable("id") final String id) {
        organizationRepository.deleteById(token, id);
    }

    @RequestMapping(value = "/organizations/{id}", method = RequestMethod.GET)
    public @ResponseBody Organization getOrganization(@RequestHeader("Authorization") String token, @PathVariable("id") final String id) {
        return organizationRepository.getById(token, id, 2);
    }

    @RequestMapping(value = "/organizations", method = RequestMethod.GET)
    public @ResponseBody List<Organization> getOrganizations(@RequestHeader("Authorization") final String token) {
        return organizationRepository.getAll(token, 2);
    }

    @RequestMapping(value = "/organizations/{id}", method = RequestMethod.PUT)
    public @ResponseBody String updateOrganization(@RequestHeader("Authorization") String token, 
    		@PathVariable("id") String id, @RequestBody String body) {
        return organizationRepository.updateOrganization(token, id, body);
    }

}
