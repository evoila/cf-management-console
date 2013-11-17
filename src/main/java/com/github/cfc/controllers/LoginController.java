package com.github.cfc.controllers;

import com.github.cfc.api.model.AccessToken;
import com.github.cfc.api.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/api")
public class LoginController {

    private final UserRepository userRepository;

    @Autowired
    public LoginController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public AccessToken login(@RequestParam("username") String username, @RequestParam("password")  String password) {
        return userRepository.login(username, password);
    }

}
