/**
 * 
 */
package com.github.cfmc.controllers;

import com.github.cfmc.api.model.AccessToken;
import com.github.cfmc.api.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 
 * @author Johannes Hiemer.
 *
 */
@Controller
@RequestMapping(value = "/api")
public class LoginController {

	@Autowired
    private UserRepository userRepository;

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public @ResponseBody AccessToken login(@RequestParam("username") String username, @RequestParam("password")  String password) {
        return userRepository.login(username, password);
    }

}
