package com.github.cfmc.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.cfmc.api.model.User;
import com.github.cfmc.api.model.UserInfo;
import com.github.cfmc.api.repositories.UserRepository;

@Controller
@RequestMapping("/api")
public class UserController {

	@Autowired
    private UserRepository userRepository;

    @RequestMapping(value = "/users", method = RequestMethod.GET)
    public @ResponseBody List<User> getAllUsers(@RequestHeader("Authorization") final String token) {
        return userRepository.getAllUsers(token);
    }

    @RequestMapping(value = "/userinfo", method = RequestMethod.GET)
   
    public  @ResponseBody UserInfo getUserInfo(@RequestHeader("Authorization") final String token) {
        return userRepository.getUserInfo(token);
    }

    @RequestMapping(value = "/users", method = RequestMethod.POST)
    public void registerUser(@RequestParam("username") String username, @RequestParam("firstName") String firstName, 
    		@RequestParam("lastName") String lastName, @RequestParam("password") String password) {
        userRepository.registerUser(username, firstName, lastName, password);
    }

}
