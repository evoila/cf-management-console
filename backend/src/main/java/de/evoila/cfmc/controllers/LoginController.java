/**
 * 
 */
package de.evoila.cfmc.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import de.evoila.cfmc.api.model.AccessToken;
import de.evoila.cfmc.api.repositories.UserRepository;

/**
 * 
 * @author Johannes Hiemer.
 *
 */
@RestController
@RequestMapping(value = "/api")
public class LoginController {

	@Autowired
    private UserRepository userRepository;

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public @ResponseBody AccessToken login(@RequestParam("username") String username, @RequestParam("password")  String password) {
        return userRepository.login(username, password);
    }

}
