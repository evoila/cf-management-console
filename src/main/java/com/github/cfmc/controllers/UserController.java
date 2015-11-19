/**
 * 
 */
package com.github.cfmc.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.cfmc.api.model.Organization;
import com.github.cfmc.api.model.OrganizationUser;
import com.github.cfmc.api.model.RegisterUser;
import com.github.cfmc.api.model.Space;
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
	
    @RequestMapping(value = "/users/{id}", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<OrganizationUser>> getUsersByOrganizationId(@RequestHeader("Authorization") final String token, 
    		@PathVariable("id") final String id) {
    	CloudFoundryResources<OrganizationUser> orgUsers = restRepository.list(token, V2_ORGANIZATIONS.concat(id).concat("/users"), 2, true);
    	return orgUsers.getResources();
    }
    
    
    @RequestMapping(value = "/user/{userId}", method = RequestMethod.GET)
    public @ResponseBody CloudFoundryResource<OrganizationUser> getUserByUserId(@PathVariable("userId") final String userId) {
    	String token = userRepository.login();
    	return restRepository.one(token, V2_USERS, userId, 1);
    }
    
   
    @RequestMapping(value = "/users/{userId}/organizations/{orgId}", method = RequestMethod.PUT)
    public @ResponseBody CloudFoundryResource<OrganizationUser> addUserToOrganization(@PathVariable("userId") final String userId, 
    		@PathVariable("orgId") final String orgId, @RequestBody CloudFoundryResource<OrganizationUser> orgUserDummy) {
    		String token = userRepository.login();
    	return restRepository.update(token, V2_USERS.concat(userId).concat("/organizations/").concat(orgId), orgUserDummy);
    }
       
	@RequestMapping(value = "/users/{userId}/managed_organizations", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Organization>> getManagedOrgsForUser(@PathVariable("userId") final String userId) {
		String token = userRepository.login();
		CloudFoundryResources<Organization> managedOrgas = restRepository.list(token, V2_USERS.concat(userId).concat("/managed_organizations"), 2, true);
    	return managedOrgas.getResources();
    }
	
	@RequestMapping(value = "/users/{userId}/managed_organizations/{orgId}", method = RequestMethod.PUT)
	public @ResponseBody CloudFoundryResource<OrganizationUser> setManagedOrganizationForUser(@PathVariable("userId") final String userId, 
			@PathVariable("orgId") final String orgId, @RequestBody CloudFoundryResource<OrganizationUser> orgUserDummy) {
		String token = userRepository.login();
		return restRepository.update(token, V2_USERS.concat(userId).concat("/managed_organizations/").concat(orgId), orgUserDummy);
    }

	@RequestMapping(value = "/users/{userId}/managed_organizations/{orgId}", method = RequestMethod.DELETE)
	public void removeManagedOrganizationForUser(@PathVariable("userId") final String userId, @PathVariable("orgId") final String orgId) {
		String token = userRepository.login();
		restRepository.delete(token, V2_USERS.concat(userId).concat("/managed_organizations"), orgId);
    }
		
	@RequestMapping(value = "/users/{userId}/billing_managed_organizations", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Space>> getBillingManagedOrgsForUser(@PathVariable("userId") final String userId) {
		String token = userRepository.login();
    	CloudFoundryResources<Space> billingManagedOrgs = restRepository.list(token, V2_USERS.concat(userId).concat("/billing_managed_organizations"), 2, true);
    	return billingManagedOrgs.getResources();
    }
	
	@RequestMapping(value = "/users/{userId}/billing_managed_organizations/{orgId}", method = RequestMethod.PUT)
	public @ResponseBody CloudFoundryResource<OrganizationUser> setBillingManagedOrganizationForUser(@PathVariable("userId") final String userId, 
			@PathVariable("orgId") final String orgId, @RequestBody CloudFoundryResource<OrganizationUser> orgUserDummy) {
		String token = userRepository.login();
		return restRepository.update(token, V2_USERS.concat(userId).concat("/billing_managed_organizations/").concat(orgId), orgUserDummy);
    }
	
	@RequestMapping(value = "/users/{userId}/billing_managed_organizations/{orgId}", method = RequestMethod.DELETE)
	public void removeBillingManagedOrganizationForUser(@PathVariable("userId") final String userId, @PathVariable("orgId") final String orgId) {
		String token = userRepository.login();
		restRepository.delete(token, V2_USERS.concat(userId).concat("/billing_managed_organizations"), orgId);
    }	
	
	@RequestMapping(value = "/users/{userId}/audited_organizations", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Space>> getAuditedOrgsForUser(@PathVariable("userId") final String userId) {
		String token = userRepository.login();
    	CloudFoundryResources<Space> auditedOrgs = restRepository.list(token, V2_USERS.concat(userId).concat("/audited_organizations"), 2, true);
    	return auditedOrgs.getResources();
    }
	
	@RequestMapping(value = "/users/{userId}/audited_organizations/{orgId}", method = RequestMethod.PUT)
	public @ResponseBody CloudFoundryResource<OrganizationUser> setAuditedOrganizationForUser(@PathVariable("userId") final String userId, 
			@PathVariable("orgId") final String orgId, @RequestBody CloudFoundryResource<OrganizationUser> orgUserDummy) {
		String token = userRepository.login();
		return restRepository.update(token, V2_USERS.concat(userId).concat("/audited_organizations/").concat(orgId), orgUserDummy);
    }
	
	@RequestMapping(value = "/users/{userId}/audited_organizations/{orgId}", method = RequestMethod.DELETE)
	public void removeAuditedOrganizationFromUser(@PathVariable("userId") final String userId, @PathVariable("orgId") final String orgId) {
		String token = userRepository.login();
		restRepository.delete(token, V2_USERS.concat(userId).concat("/audited_organizations"), orgId);
    }
	
    @RequestMapping(value = "/users/{userId}/managed_spaces", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Space>> getManagedSpacesForUser(@PathVariable("userId") final String userId) {
    	String token = userRepository.login();
    	CloudFoundryResources<Space> managedSpaces = restRepository.list(token, V2_USERS.concat(userId).concat("/managed_spaces"), 2, true);
    	return managedSpaces.getResources();
    }
  
    @RequestMapping(value = "/users/{userId}/managed_spaces/{spaceId}", method = RequestMethod.PUT)
	public @ResponseBody CloudFoundryResource<OrganizationUser> setManagedSpaceForUser(@PathVariable("userId") final String userId, 
			@PathVariable("spaceId") final String spaceId, @RequestBody CloudFoundryResource<OrganizationUser> orgUserDummy) {
    	String token = userRepository.login();
		return restRepository.update(token, V2_USERS.concat(userId).concat("/managed_spaces/").concat(spaceId), orgUserDummy);
    }
    
    @RequestMapping(value = "/users/{userId}/managed_spaces/{spaceId}", method = RequestMethod.DELETE)
	public void removeManagedSpaceFromUser(@PathVariable("userId") final String userId, @PathVariable("spaceId") final String spaceId) {
    	String token = userRepository.login();
		restRepository.delete(token, V2_USERS.concat(userId).concat("/managed_spaces"), spaceId);
    }
    
    @RequestMapping(value = "/users/{userId}/spaces", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Space>> getSpacesForUser(@PathVariable("userId") final String userId) {
    	String token = userRepository.login();
    	CloudFoundryResources<Space> spaces = restRepository.list(token, V2_USERS.concat(userId).concat("/spaces"), 2, true);
    	return spaces.getResources();
    }

    @RequestMapping(value = "/users/{userId}/spaces/{spaceId}", method = RequestMethod.PUT)
    public @ResponseBody CloudFoundryResource<OrganizationUser> setSpaceForUser(@PathVariable("userId") final String userId, 
    		@PathVariable("spaceId") final String spaceId, @RequestBody CloudFoundryResource<OrganizationUser> orgUserDummy) {
    	String token = userRepository.login();
    	return restRepository.update(token, V2_USERS.concat(userId).concat("/spaces/").concat(spaceId), orgUserDummy);
    }
    
    @RequestMapping(value = "/users/{userId}/spaces/{spaceId}", method = RequestMethod.DELETE)
	public void removeSpaceFromUser(@PathVariable("userId") final String userId, @PathVariable("spaceId") final String spaceId) {
    	String token = userRepository.login();
		restRepository.delete(token, V2_USERS.concat(userId).concat("/spaces"), spaceId);
    }
    
    @RequestMapping(value = "/users/{userId}/audited_spaces", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Space>> getAuditedSpacesForUser(@PathVariable("userId") final String userId) {
    	String token = userRepository.login();
    	CloudFoundryResources<Space> auditedSpaces = restRepository.list(token, V2_USERS.concat(userId).concat("/audited_spaces"), 2, true);
    	return auditedSpaces.getResources();
    }
    
    @RequestMapping(value = "/users/{userId}/audited_spaces/{spaceId}", method = RequestMethod.PUT)
    public @ResponseBody CloudFoundryResource<OrganizationUser> setAuditedSpaceForUser(@PathVariable("userId") final String userId, 
    		@PathVariable("spaceId") final String spaceId, @RequestBody CloudFoundryResource<OrganizationUser> orgUserDummy) {
    	String token = userRepository.login();
    	return restRepository.update(token, V2_USERS.concat(userId).concat("/audited_spaces/").concat(spaceId), orgUserDummy);
    }
    
    @RequestMapping(value = "/users/{userId}/audited_spaces/{spaceId}", method = RequestMethod.DELETE)
    public void removeAuditedSpaceFromUser(@PathVariable("userId") final String userId, @PathVariable("spaceId") final String spaceId) {
    	String token = userRepository.login();
    	restRepository.delete(token, V2_USERS.concat(userId).concat("/audited_spaces"), spaceId);
    }

    @RequestMapping(value = "/userinfo", method = RequestMethod.GET)
    public @ResponseBody UserInfo getUserInfo(@RequestHeader("Authorization") String token) {
    	UserInfo userInfo = userRepository.getUserInfo(token);
    	return userInfo;
    }
    
    @RequestMapping(value = "/users", method = RequestMethod.POST)
    public @ResponseBody Map<String,Object> registerUser(@RequestBody RegisterUser user) {
    	String token = userRepository.login();
        return userRepository.registerUser(token, user.getUsername(), user.getFirstname(), 
        		user.getLastname(), user.getPassword());
    }
	
}
