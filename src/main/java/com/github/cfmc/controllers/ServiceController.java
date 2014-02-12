/**
 * 
 */
package com.github.cfmc.controllers;

import com.github.cfmc.api.model.Service;
import com.github.cfmc.api.repositories.ServiceRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * TODO: Add previous authors
 * @author Johannes Hiemer.
 *
 */
@Controller
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceRepository serviceRepository;

    @Autowired
    public ServiceController(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @RequestMapping(method = GET, produces = APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<Service> getServices(@RequestHeader("Authorization") String token) {
        return serviceRepository.getAll(token);
    }

}
