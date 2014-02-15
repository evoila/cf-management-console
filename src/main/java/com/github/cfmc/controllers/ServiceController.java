/**
 * 
 */
package com.github.cfmc.controllers;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.cfmc.api.model.Service;
import com.github.cfmc.api.repositories.ServiceRepository;

/**
 * 
 * @author Johannes Hiemer.
 *
 */
@Controller
@RequestMapping("/api/services")
public class ServiceController {

	@Autowired
    private ServiceRepository serviceRepository;

    @RequestMapping(method = GET)
    public @ResponseBody List<Service> getServices(@RequestHeader("Authorization") String token) {
        return serviceRepository.getAll(token);
    }

}
