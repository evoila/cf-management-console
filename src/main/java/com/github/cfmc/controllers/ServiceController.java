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
import com.github.cfmc.api.model.base.CloudFoundryResource;
import com.github.cfmc.api.model.base.CloudFoundryResources;
import com.github.cfmc.api.repositories.RestRepository;

/**
 * 
 * @author Johannes Hiemer.
 *
 */
@Controller
@RequestMapping("/api")
public class ServiceController {

	@Autowired
    private RestRepository restRepository;
	
	private static String V2_SERVICES = "v2/services";

    @RequestMapping(value = "/services", method = GET)
    public @ResponseBody List<CloudFoundryResource<Service>> getServices(@RequestHeader("Authorization") String token) {
        CloudFoundryResources<Service> services = restRepository.apiGetv2(token, V2_SERVICES);
        return services.getResources();
    }

}
