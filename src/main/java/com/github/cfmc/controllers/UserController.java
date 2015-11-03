/**
 * 
 */
package com.github.cfmc.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.cfmc.api.model.OrganizationUser;
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

    @RequestMapping(value = "/users", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<SpaceUser>> getAllUsers(@RequestHeader("Authorization") String token) {
        return userRepository.getAllUsers(token);
    }
       
    // TODO
    @RequestMapping(value = "/orgUsers/{id}", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<OrganizationUser>> getUsersByOrganizationId(@RequestHeader("Authorization") final String token, 
    		@PathVariable("id") final String id) {
    	CloudFoundryResources<OrganizationUser> orgUsers = restRepository.list(token, "v2/organizations/".concat(id).concat("/users"), 2);
    	return orgUsers.getResources();
    }
    
    @RequestMapping(value = "/userinfo", method = RequestMethod.GET)
    public @ResponseBody UserInfo getUserInfo(@RequestHeader("Authorization") String token) {
    	UserInfo userInfo = userRepository.getUserInfo(token);
    	return userInfo;
    }

    @RequestMapping(value = "/users", method = RequestMethod.POST)
    public void registerUser(@RequestParam("username") String username, @RequestParam("firstName") String firstName, 
    		@RequestParam("lastName") String lastName, @RequestParam("password") String password) {
        userRepository.registerUser(username, firstName, lastName, password);
    }

}
