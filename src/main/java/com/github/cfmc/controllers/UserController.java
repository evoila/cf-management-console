/**
 * 
 */
package com.github.cfmc.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.cfmc.api.model.Organization;
import com.github.cfmc.api.model.OrganizationUser;
import com.github.cfmc.api.model.Space;
import com.github.cfmc.api.model.SpaceUser;
import com.github.cfmc.api.model.UserInfo;
import com.github.cfmc.api.model.base.CloudFoundryResource;
import com.github.cfmc.api.model.base.CloudFoundryResources;
import com.github.cfmc.api.repositories.RestRepository;
import com.github.cfmc.api.repositories.UserRepository;

/**
 * 
 * @author Johannes Hiemer.
 *
 */
@Controller
@RequestMapping(value = "/api")
public class UserController {

	@Autowired
    private UserRepository userRepository;
	
	@Autowired
    private RestRepository restRepository;
	
	private static final String V2_ORGANIZATIONS = "v2/organizations/";
	private static final String V2_USERS = "v2/users/";
	
	/*
    @RequestMapping(value = "/users", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<SpaceUser>> getAllUsers(@RequestHeader("Authorization") String token) {
        return userRepository.getAllUsers(token);
    }
    */  
    
    
    // Tobi
    @RequestMapping(value = "/users/{id}", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<OrganizationUser>> getUsersByOrganizationId(@RequestHeader("Authorization") final String token, 
    		@PathVariable("id") final String id) {
    	CloudFoundryResources<OrganizationUser> orgUsers = restRepository.list(token, V2_ORGANIZATIONS.concat(id).concat("/users"), 2);
    	return orgUsers.getResources();
    }
    // TODO: update method only with CloudFoundryResource in @RequestBody
    @RequestMapping(value = "/users/{userId}/organizations/{orgId}", method = RequestMethod.PUT)
    public @ResponseBody CloudFoundryResource<OrganizationUser> addUserToOrganization(@RequestHeader("Authorization") final String token, 
    		@PathVariable("userId") final String userId, @PathVariable("orgId") final String orgId, @RequestBody CloudFoundryResource<OrganizationUser> orgUserDummy) {
    	return restRepository.update(token, V2_USERS.concat(userId).concat("/organizations/").concat(orgId), orgUserDummy);
    }
    
    /*
     * 	Managed Organizations
     */
	@RequestMapping(value = "/users/{userId}/managed_organizations", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Organization>> getManagedOrgsForUser(@RequestHeader("Authorization") final String token, 
    		@PathVariable("userId") final String userId) {
		CloudFoundryResources<Organization> managedOrgas = restRepository.list(token, V2_USERS.concat(userId).concat("/managed_organizations"), 2);
    	return managedOrgas.getResources();
    }
	@RequestMapping(value = "/users/{userId}/managed_organizations/{orgId}", method = RequestMethod.PUT)
	public @ResponseBody CloudFoundryResource<OrganizationUser> setManagedOrganizationForUser(@RequestHeader("Authorization") final String token, 
    		@PathVariable("userId") final String userId, @PathVariable("orgId") final String orgId, @RequestBody CloudFoundryResource<OrganizationUser> orgUserDummy) {
		return restRepository.update(token, V2_USERS.concat(userId).concat("/managed_organizations/").concat(orgId), orgUserDummy);
    }
	// no return for delete?
	// evoila nicht funktioniert, playground schon
	@RequestMapping(value = "/users/{userId}/managed_organizations/{orgId}", method = RequestMethod.DELETE)
	public void removeManagedOrganizationForUser(@RequestHeader("Authorization") final String token, 
    		@PathVariable("userId") final String userId, @PathVariable("orgId") final String orgId) {
		restRepository.delete(token, V2_USERS.concat(userId).concat("/managed_organizations"), orgId);
    }
		
	/*
     * 	Billing Managed Organizations
     */
	@RequestMapping(value = "/users/{userId}/billing_managed_organizations", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Space>> getBillingManagedOrgsForUser(@RequestHeader("Authorization") final String token, 
    		@PathVariable("userId") final String userId) {
    	CloudFoundryResources<Space> billingManagedOrgs = restRepository.list(token, V2_USERS.concat(userId).concat("/billing_managed_organizations"), 2);
    	return billingManagedOrgs.getResources();
    }
	@RequestMapping(value = "/users/{userId}/billing_managed_organizations/{orgId}", method = RequestMethod.PUT)
	public @ResponseBody CloudFoundryResource<OrganizationUser> setBillingManagedOrganizationForUser(@RequestHeader("Authorization") final String token, 
    		@PathVariable("userId") final String userId, @PathVariable("orgId") final String orgId, @RequestBody CloudFoundryResource<OrganizationUser> orgUserDummy) {
		return restRepository.update(token, V2_USERS.concat(userId).concat("/billing_managed_organizations/").concat(orgId), orgUserDummy);
    }
	@RequestMapping(value = "/users/{userId}/billing_managed_organizations/{orgId}", method = RequestMethod.DELETE)
	public void removeBillingManagedOrganizationForUser(@RequestHeader("Authorization") final String token, 
    		@PathVariable("userId") final String userId, @PathVariable("orgId") final String orgId) {
		restRepository.delete(token, V2_USERS.concat(userId).concat("/billing_managed_organizations"), orgId);
    }	
	
	/*
     * 	Audited Organizations
     */
	@RequestMapping(value = "/users/{userId}/audited_organizations", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Space>> getAuditedOrgsForUser(@RequestHeader("Authorization") final String token, 
    		@PathVariable("userId") final String userId) {
    	CloudFoundryResources<Space> auditedOrgs = restRepository.list(token, V2_USERS.concat(userId).concat("/audited_organizations"), 2);
    	return auditedOrgs.getResources();
    }
	@RequestMapping(value = "/users/{userId}/audited_organizations/{orgId}", method = RequestMethod.PUT)
	public @ResponseBody CloudFoundryResource<OrganizationUser> setAuditedOrganizationForUser(@RequestHeader("Authorization") final String token, 
    		@PathVariable("userId") final String userId, @PathVariable("orgId") final String orgId, @RequestBody CloudFoundryResource<OrganizationUser> orgUserDummy) {
		return restRepository.update(token, V2_USERS.concat(userId).concat("/audited_organizations/").concat(orgId), orgUserDummy);
    }
	@RequestMapping(value = "/users/{userId}/audited_organizations/{orgId}", method = RequestMethod.DELETE)
	public void removeAuditedOrganizationFromUser(@RequestHeader("Authorization") final String token, 
    		@PathVariable("userId") final String userId, @PathVariable("orgId") final String orgId) {
		restRepository.delete(token, V2_USERS.concat(userId).concat("/audited_organizations"), orgId);
    }
	
	
	/*
     * 	Managed Spaces
     */
    @RequestMapping(value = "/users/{userId}/managed_spaces", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Space>> getManagedSpacesForUser(@RequestHeader("Authorization") final String token, 
    		@PathVariable("userId") final String userId) {
    	CloudFoundryResources<Space> managedSpaces = restRepository.list(token, V2_USERS.concat(userId).concat("/managed_spaces"), 2);
    	return managedSpaces.getResources();
    }
    @RequestMapping(value = "/users/{userId}/managed_spaces/{spaceId}", method = RequestMethod.PUT)
	public @ResponseBody CloudFoundryResource<OrganizationUser> setManagedSpaceForUser(@RequestHeader("Authorization") final String token, 
    		@PathVariable("userId") final String userId, @PathVariable("spaceId") final String spaceId, @RequestBody CloudFoundryResource<OrganizationUser> orgUserDummy) {
		return restRepository.update(token, V2_USERS.concat(userId).concat("/managed_spaces/").concat(spaceId), orgUserDummy);
    }
    @RequestMapping(value = "/users/{userId}/managed_spaces/{spaceId}", method = RequestMethod.DELETE)
	public void removeManagedSpaceFromUser(@RequestHeader("Authorization") final String token, 
    		@PathVariable("userId") final String userId, @PathVariable("spaceId") final String spaceId) {
		restRepository.delete(token, V2_USERS.concat(userId).concat("/managed_spaces"), spaceId);
    }
    
    /*
     * 	Spaces (Space Developer)
     */
    @RequestMapping(value = "/users/{userId}/spaces", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Space>> getSpacesForUser(@RequestHeader("Authorization") final String token, 
    		@PathVariable("userId") final String userId) {
    	CloudFoundryResources<Space> spaces = restRepository.list(token, V2_USERS.concat(userId).concat("/spaces"), 2);
    	return spaces.getResources();
    }
    // entspr. Associate Space with the User -> user wird dann als developer aufgelistet
    @RequestMapping(value = "/users/{userId}/spaces/{spaceId}", method = RequestMethod.PUT)
    public @ResponseBody CloudFoundryResource<OrganizationUser> setSpaceForUser(@RequestHeader("Authorization") final String token, 
    		@PathVariable("userId") final String userId, @PathVariable("spaceId") final String spaceId, @RequestBody CloudFoundryResource<OrganizationUser> orgUserDummy) {
    	return restRepository.update(token, V2_USERS.concat(userId).concat("/spaces/").concat(spaceId), orgUserDummy);
    }
    @RequestMapping(value = "/users/{userId}/spaces/{spaceId}", method = RequestMethod.DELETE)
	public void removeSpaceFromUser(@RequestHeader("Authorization") final String token, 
    		@PathVariable("userId") final String userId, @PathVariable("spaceId") final String spaceId) {
		restRepository.delete(token, V2_USERS.concat(userId).concat("/spaces"), spaceId);
    }
    
    /*
     * 	Audited Spaces
     */
    @RequestMapping(value = "/users/{userId}/audited_spaces", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Space>> getAuditedSpacesForUser(@RequestHeader("Authorization") final String token, 
    		@PathVariable("userId") final String userId) {
    	CloudFoundryResources<Space> auditedSpaces = restRepository.list(token, V2_USERS.concat(userId).concat("/audited_spaces"), 2);
    	return auditedSpaces.getResources();
    }
    
    @RequestMapping(value = "/users/{userId}/audited_spaces/{spaceId}", method = RequestMethod.PUT)
    public @ResponseBody CloudFoundryResource<OrganizationUser> setAuditedSpaceForUser(@RequestHeader("Authorization") final String token, 
    		@PathVariable("userId") final String userId, @PathVariable("spaceId") final String spaceId, @RequestBody CloudFoundryResource<OrganizationUser> orgUserDummy) {
    	return restRepository.update(token, V2_USERS.concat(userId).concat("/audited_spaces/").concat(spaceId), orgUserDummy);
    }
    
    @RequestMapping(value = "/users/{userId}/audited_spaces/{spaceId}", method = RequestMethod.DELETE)
    public void removeAuditedSpaceFromUser(@RequestHeader("Authorization") final String token, 
    		@PathVariable("userId") final String userId, @PathVariable("spaceId") final String spaceId) {
    	restRepository.delete(token, V2_USERS.concat(userId).concat("/audited_spaces"), spaceId);
    }
    
    
    
    
    
    
    
    
    
    
    
    @RequestMapping(value = "/userinfo", method = RequestMethod.GET)
    public @ResponseBody UserInfo getUserInfo(@RequestHeader("Authorization") String token) {
    	UserInfo userInfo = userRepository.getUserInfo(token);
    	return userInfo;
    }
    
    @RequestMapping(value = "/users", method = RequestMethod.POST)
    public @ResponseBody Map<String,Object> registerUser(@RequestHeader("Authorization") String token, @RequestParam("username") String username, @RequestParam("firstName") String firstName, 
    		@RequestParam("lastName") String lastName, @RequestParam("password") String password) {
        return userRepository.registerUser(token, username, firstName, lastName, password);
    }
	
}
