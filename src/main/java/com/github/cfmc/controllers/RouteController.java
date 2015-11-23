/**
 * 
 */
package com.github.cfmc.controllers;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

import com.github.cfmc.api.model.Route;
import com.github.cfmc.api.model.base.CloudFoundryResource;
import com.github.cfmc.api.model.base.CloudFoundryResources;
import com.github.cfmc.api.repositories.RestRepository;


/**
 * 
 * @author Johannes Hiemer.
 *
 */
@Controller
@RequestMapping(value = "/api")
public class RouteController {
	
	@Autowired
    private RestRepository restRepository;
	
	@Autowired
    protected RestTemplate restTemplate;
	
	private static final String V2_ROUTES = "v2/routes";
	
	
	@RequestMapping(value = "/routes", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Route>> getRoutes(@RequestHeader("Authorization") final String token) {
		CloudFoundryResources<Route> routes = restRepository.list(token, V2_ROUTES, 1, true);
		return routes.getResources();
    }
		
	@RequestMapping(value = "/routes/{id}", method = RequestMethod.GET)
    public @ResponseBody CloudFoundryResource<Route> getRoute(@RequestHeader("Authorization") String token, @PathVariable("id") final String id) {
		CloudFoundryResource<Route> route = restRepository.one(token, V2_ROUTES, id, 1);
		return route;
    }
	
	@RequestMapping(value = "/routes/{host}/{domainId}/exists", method = RequestMethod.GET)
    public @ResponseBody boolean checkIfRouteNameExists(
    		@RequestHeader("Authorization") final String token, @PathVariable("host") final String host,
    		@PathVariable("domainId") final String domainId) {
		boolean nameExists = false;
		
		CloudFoundryResources<Route> routes = restRepository.list(token, V2_ROUTES.concat("?q=host:").concat(host.toLowerCase()), 2, false);
		if(routes.getTotalResults() > 0)
			nameExists = true;
		
		return nameExists;
    }
	
	@RequestMapping(value = "/routes/{host}/{domainId}", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Route>> searchRoutes(
    		@RequestHeader("Authorization") final String token, @PathVariable("host") final String host,
    		@PathVariable("domainId") final String domainId) {
		
		CloudFoundryResources<Route> routes = restRepository.list(token, V2_ROUTES.concat("?q=host:").concat(host.toLowerCase()), 2, false);
		
		return routes.getResources();
    }
	
	@RequestMapping(value = "/routes", method = RequestMethod.POST)
    public @ResponseBody CloudFoundryResource<Route> createRoute(
    		@RequestHeader("Authorization") final String token, @RequestBody Route route) {		
		return restRepository.save(token, V2_ROUTES, new CloudFoundryResource<Route>(route));
    }
    
    @RequestMapping(value = "/routes/{id}", method = RequestMethod.PUT)
    public @ResponseBody CloudFoundryResource<Route> updateOrganization(@RequestHeader("Authorization") String token, 
    		@PathVariable("id") String id, @RequestBody CloudFoundryResource<Route> route) {
    	return restRepository.update(token, V2_ROUTES.concat("/").concat(id), route);
    }

    @RequestMapping(value = "/routes/{id}", method = RequestMethod.DELETE)
    public void deleteOrganizationById(@RequestHeader("Authorization") final String token, @PathVariable("id") final String id) {
        restRepository.delete(token, V2_ROUTES, id);
    }
    
    @RequestMapping(value = "/routes/{id}/apps/{appId}", method = RequestMethod.DELETE)
    public void mapRoute(String token, @PathVariable("id") String route, @PathVariable("appId") String app) {		
		restRepository.update(token, V2_ROUTES.concat("/").concat(route).concat("/apps/").concat(app), new CloudFoundryResource<>());
    }

}
