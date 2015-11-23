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
    	String adminToken = userRepository.login();
    	CloudFoundryResources<OrganizationUser> orgUsers = restRepository.list(adminToken, V2_ORGANIZATIONS.concat(id).concat("/users"), 2, true);
    	return orgUsers.getResources();
    }
       
    @RequestMapping(value = "/user/{userId}", method = RequestMethod.GET)
    public @ResponseBody CloudFoundryResource<OrganizationUser> getUserByUserId(@RequestHeader("Authorization") final String token, 
    		@PathVariable("userId") final String userId) {
    	String adminToken = userRepository.login();
    	return restRepository.one(adminToken, V2_USERS, userId, 1);
    }
     
    @RequestMapping(value = "/users/{userId}/organizations/{orgId}", method = RequestMethod.PUT)
    public @ResponseBody CloudFoundryResource<OrganizationUser> addUserToOrganization(@RequestHeader("Authorization") final String token,
    		@PathVariable("userId") final String userId, @PathVariable("orgId") final String orgId, @RequestBody CloudFoundryResource<OrganizationUser> orgUserDummy) {
    		String adminToken = userRepository.login();
    	return restRepository.update(adminToken, V2_USERS.concat(userId).concat("/organizations/").concat(orgId), orgUserDummy);
    }
       
	@RequestMapping(value = "/users/{userId}/managed_organizations", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Organization>> getManagedOrgsForUser(@RequestHeader("Authorization") final String token,
    		@PathVariable("userId") final String userId) {
		String adminToken = userRepository.login();
		CloudFoundryResources<Organization> managedOrgas = restRepository.list(adminToken, V2_USERS.concat(userId).concat("/managed_organizations"), 2, true);
    	return managedOrgas.getResources();
    }
	
	@RequestMapping(value = "/users/{userId}/managed_organizations/{orgId}", method = RequestMethod.PUT)
	public @ResponseBody CloudFoundryResource<OrganizationUser> setManagedOrganizationForUser(@RequestHeader("Authorization") final String token,
			@PathVariable("userId") final String userId, @PathVariable("orgId") final String orgId, @RequestBody CloudFoundryResource<OrganizationUser> orgUserDummy) {
		String adminToken = userRepository.login();
		return restRepository.update(adminToken, V2_USERS.concat(userId).concat("/managed_organizations/").concat(orgId), orgUserDummy);
    }

	@RequestMapping(value = "/users/{userId}/managed_organizations/{orgId}", method = RequestMethod.DELETE)
	public void removeManagedOrganizationForUser(@RequestHeader("Authorization") final String token,
			@PathVariable("userId") final String userId, @PathVariable("orgId") final String orgId) {
		String adminToken = userRepository.login();
		restRepository.delete(adminToken, V2_USERS.concat(userId).concat("/managed_organizations"), orgId);
    }
		
	@RequestMapping(value = "/users/{userId}/billing_managed_organizations", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Space>> getBillingManagedOrgsForUser(@RequestHeader("Authorization") final String token,
    		@PathVariable("userId") final String userId) {
		String adminToken = userRepository.login();
    	CloudFoundryResources<Space> billingManagedOrgs = restRepository.list(adminToken, V2_USERS.concat(userId).concat("/billing_managed_organizations"), 2, true);
    	return billingManagedOrgs.getResources();
    }
	
	@RequestMapping(value = "/users/{userId}/billing_managed_organizations/{orgId}", method = RequestMethod.PUT)
	public @ResponseBody CloudFoundryResource<OrganizationUser> setBillingManagedOrganizationForUser(@RequestHeader("Authorization") final String token,
			@PathVariable("userId") final String userId, @PathVariable("orgId") final String orgId, @RequestBody CloudFoundryResource<OrganizationUser> orgUserDummy) {
		String adminToken = userRepository.login();
		return restRepository.update(adminToken, V2_USERS.concat(userId).concat("/billing_managed_organizations/").concat(orgId), orgUserDummy);
    }
	
	@RequestMapping(value = "/users/{userId}/billing_managed_organizations/{orgId}", method = RequestMethod.DELETE)
	public void removeBillingManagedOrganizationForUser(@RequestHeader("Authorization") final String token,
			@PathVariable("userId") final String userId, @PathVariable("orgId") final String orgId) {
		String adminToken = userRepository.login();
		restRepository.delete(adminToken, V2_USERS.concat(userId).concat("/billing_managed_organizations"), orgId);
    }	
	
	@RequestMapping(value = "/users/{userId}/audited_organizations", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Space>> getAuditedOrgsForUser(@RequestHeader("Authorization") final String token,
    		@PathVariable("userId") final String userId) {
		String adminToken = userRepository.login();
    	CloudFoundryResources<Space> auditedOrgs = restRepository.list(adminToken, V2_USERS.concat(userId).concat("/audited_organizations"), 2, true);
    	return auditedOrgs.getResources();
    }
	
	@RequestMapping(value = "/users/{userId}/audited_organizations/{orgId}", method = RequestMethod.PUT)
	public @ResponseBody CloudFoundryResource<OrganizationUser> setAuditedOrganizationForUser(@RequestHeader("Authorization") final String token,
			@PathVariable("userId") final String userId, @PathVariable("orgId") final String orgId, 
			@RequestBody CloudFoundryResource<OrganizationUser> orgUserDummy) {
		String adminToken = userRepository.login();
		return restRepository.update(adminToken, V2_USERS.concat(userId).concat("/audited_organizations/").concat(orgId), orgUserDummy);
    }
	
	@RequestMapping(value = "/users/{userId}/audited_organizations/{orgId}", method = RequestMethod.DELETE)
	public void removeAuditedOrganizationFromUser(@RequestHeader("Authorization") final String token,
			@PathVariable("userId") final String userId, @PathVariable("orgId") final String orgId) {
		String adminToken = userRepository.login();
		restRepository.delete(adminToken, V2_USERS.concat(userId).concat("/audited_organizations"), orgId);
    }
	
    @RequestMapping(value = "/users/{userId}/managed_spaces", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Space>> getManagedSpacesForUser(@RequestHeader("Authorization") final String token,
    		@PathVariable("userId") final String userId) {
    	String adminToken = userRepository.login();
    	CloudFoundryResources<Space> managedSpaces = restRepository.list(adminToken, V2_USERS.concat(userId).concat("/managed_spaces"), 2, true);
    	return managedSpaces.getResources();
    }
  
    @RequestMapping(value = "/users/{userId}/managed_spaces/{spaceId}", method = RequestMethod.PUT)
	public @ResponseBody CloudFoundryResource<OrganizationUser> setManagedSpaceForUser(@RequestHeader("Authorization") final String token,
			@PathVariable("userId") final String userId, @PathVariable("spaceId") final String spaceId, 
			@RequestBody CloudFoundryResource<OrganizationUser> orgUserDummy) {
    	String adminToken = userRepository.login();
		return restRepository.update(adminToken, V2_USERS.concat(userId).concat("/managed_spaces/").concat(spaceId), orgUserDummy);
    }
    
    @RequestMapping(value = "/users/{userId}/managed_spaces/{spaceId}", method = RequestMethod.DELETE)
	public void removeManagedSpaceFromUser(@RequestHeader("Authorization") final String token,
			@PathVariable("userId") final String userId, @PathVariable("spaceId") final String spaceId) {
    	String adminToken = userRepository.login();
		restRepository.delete(adminToken, V2_USERS.concat(userId).concat("/managed_spaces"), spaceId);
    }
    
    @RequestMapping(value = "/users/{userId}/spaces", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Space>> getSpacesForUser(@RequestHeader("Authorization") final String token,
    		@PathVariable("userId") final String userId) {
    	String adminToken = userRepository.login();
    	CloudFoundryResources<Space> spaces = restRepository.list(adminToken, V2_USERS.concat(userId).concat("/spaces"), 2, true);
    	return spaces.getResources();
    }

    @RequestMapping(value = "/users/{userId}/spaces/{spaceId}", method = RequestMethod.PUT)
    public @ResponseBody CloudFoundryResource<OrganizationUser> setSpaceForUser(@RequestHeader("Authorization") final String token,
    		@PathVariable("userId") final String userId, @PathVariable("spaceId") final String spaceId, 
    		@RequestBody CloudFoundryResource<OrganizationUser> orgUserDummy) {
    	String adminToken = userRepository.login();
    	return restRepository.update(adminToken, V2_USERS.concat(userId).concat("/spaces/").concat(spaceId), orgUserDummy);
    }
    
    @RequestMapping(value = "/users/{userId}/spaces/{spaceId}", method = RequestMethod.DELETE)
	public void removeSpaceFromUser(@RequestHeader("Authorization") final String token,
			@PathVariable("userId") final String userId, @PathVariable("spaceId") final String spaceId) {
    	String adminToken = userRepository.login();
		restRepository.delete(adminToken, V2_USERS.concat(userId).concat("/spaces"), spaceId);
    }
    
    @RequestMapping(value = "/users/{userId}/audited_spaces", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Space>> getAuditedSpacesForUser(@RequestHeader("Authorization") final String token,
    		@PathVariable("userId") final String userId) {
    	String adminToken = userRepository.login();
    	CloudFoundryResources<Space> auditedSpaces = restRepository.list(adminToken, V2_USERS.concat(userId).concat("/audited_spaces"), 2, true);
    	return auditedSpaces.getResources();
    }
    
    @RequestMapping(value = "/users/{userId}/audited_spaces/{spaceId}", method = RequestMethod.PUT)
    public @ResponseBody CloudFoundryResource<OrganizationUser> setAuditedSpaceForUser(@RequestHeader("Authorization") final String token,
    		@PathVariable("userId") final String userId, @PathVariable("spaceId") final String spaceId, 
    		@RequestBody CloudFoundryResource<OrganizationUser> orgUserDummy) {
    	String adminToken = userRepository.login();
    	return restRepository.update(adminToken, V2_USERS.concat(userId).concat("/audited_spaces/").concat(spaceId), orgUserDummy);
    }
    
    @RequestMapping(value = "/users/{userId}/audited_spaces/{spaceId}", method = RequestMethod.DELETE)
    public void removeAuditedSpaceFromUser(@RequestHeader("Authorization") final String token,
    		@PathVariable("userId") final String userId, @PathVariable("spaceId") final String spaceId) {
    	String adminToken = userRepository.login();
    	restRepository.delete(adminToken, V2_USERS.concat(userId).concat("/audited_spaces"), spaceId);
    }

    @RequestMapping(value = "/userinfo", method = RequestMethod.GET)
    public @ResponseBody UserInfo getUserInfo(@RequestHeader("Authorization") String token) {
    	UserInfo userInfo = userRepository.getUserInfo(token);
    	return userInfo;
    }
    
    @RequestMapping(value = "/users", method = RequestMethod.POST)
    public @ResponseBody Map<String,Object> registerUser(@RequestHeader("Authorization") String token, @RequestBody RegisterUser user) {
    	String adminToken = userRepository.login();
        return userRepository.registerUser(adminToken, user.getUsername(), user.getFirstname(), 
        		user.getLastname(), user.getPassword());
    }
    
    @RequestMapping(value = "/users/{userId}", method = RequestMethod.DELETE)
    public void deleteUser(@RequestHeader("Authorization") String token, @PathVariable("userId") final String userId) {
    	restRepository.delete(token, V2_USERS, userId);
    	userRepository.deleteUser(userId);
    }
	
}
