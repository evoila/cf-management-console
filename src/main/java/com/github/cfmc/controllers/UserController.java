package com.github.cfmc.controllers;

import com.github.cfmc.api.model.User;
import com.github.cfmc.api.model.UserInfo;
import com.github.cfmc.api.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api")
public class UserController {

    private final UserRepository userRepository;

    @Autowired
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @RequestMapping(value = "/users", method = RequestMethod.GET)
    @ResponseBody
    public List<User> getAllUsers(@RequestHeader("Authorization") final String token) {
        return userRepository.getAllUsers(token);
    }

    @RequestMapping(value = "/userinfo", method = RequestMethod.GET)
    @ResponseBody
    public UserInfo getUserInfo(@RequestHeader("Authorization") final String token) {
        return userRepository.getUserInfo(token);
    }

    @RequestMapping(value = "/users", method = RequestMethod.POST)
    @ResponseBody
    public void registerUser(@RequestParam("username") String username, @RequestParam("firstName") String firstName, @RequestParam("lastName") String lastName, @RequestParam("password") String password) {
        userRepository.registerUser(username, firstName, lastName, password);
    }

}
