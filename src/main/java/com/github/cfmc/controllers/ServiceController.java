/**
 * 
 */
package com.github.cfmc.controllers;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.cfmc.api.model.Service;
import com.github.cfmc.api.model.ServiceInstance;
import com.github.cfmc.api.model.ServicePlan;
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
@RequestMapping("/api")
public class ServiceController {

	@Autowired
    private RestRepository restRepository;
	
	@Autowired
    private UserRepository userRepository;
	
	private static String V2_SERVICES = "v2/services";
	private static String V2_SERVICE_PLANS = "v2/service_plans/";
	private static String V2_SERVICE_INSTANCES = "v2/service_instances";
	
	
    @RequestMapping(value = "/services", method = GET)
    public @ResponseBody List<CloudFoundryResource<Service>> getServices(@RequestHeader("Authorization") String token) {
        CloudFoundryResources<Service> services = restRepository.list(token, V2_SERVICES, 1, true);
        return services.getResources();
    }
    
    @RequestMapping(value = "/services/{serviceId}", method = RequestMethod.GET)
    public @ResponseBody CloudFoundryResource<Service> getServiceByServiceId( @PathVariable("serviceId") final String serviceId) {
    	String token = userRepository.login();
    	return restRepository.one(token, V2_SERVICES, serviceId, 1);
    }
    
    @RequestMapping(value = "/services", method = RequestMethod.POST)
    public @ResponseBody CloudFoundryResource<Service> createSpace(@RequestHeader("Authorization") String token, 
    		@RequestBody Service service) {
        return restRepository.save(token, V2_SERVICES, new CloudFoundryResource<Service>(service));
    }
    
    @RequestMapping(value = "/services/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteSpaceById(@RequestHeader("Authorization") final String token, @PathVariable("id") final String id) {
    	restRepository.delete(token, V2_SERVICES, id);
    	return new ResponseEntity<>(HttpStatus.OK);
    }
    
    @RequestMapping(value = "/services/{id}/service_plans", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<ServicePlan>> getServicePlansForService(@PathVariable("id") final String id) {
    	String token = userRepository.login();
    	CloudFoundryResources<ServicePlan> servicePlans = restRepository.list(token, V2_SERVICES.concat("/").concat(id).concat("/service_plans"), 1, true);
    	return servicePlans.getResources();
    }
    
  
    @RequestMapping(value = "/service_instances/{orgId}", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<ServiceInstance>> getServiceInstancesForOrganization(@PathVariable("orgId") final String orgId) {
    	String token = userRepository.login();
    	CloudFoundryResources<ServiceInstance> serviceInstances = restRepository.list(token, V2_SERVICE_INSTANCES.concat("?q=organization_guid:").concat(orgId), 1, false);
    	return serviceInstances.getResources();
    }
    
    @RequestMapping(value = "/service_plans/{planId}/service_instances", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<ServiceInstance>> getServiceInstancesForServicePlan(@PathVariable("planId") final String planId) {
    	String token = userRepository.login();
    	CloudFoundryResources<ServiceInstance> serviceInstances = restRepository.list(token, V2_SERVICE_PLANS.concat(planId).concat("/service_instances"), 1, true);
    	return serviceInstances.getResources();
    }
        
    @RequestMapping(value = "/service_instances", method = RequestMethod.POST)
    public @ResponseBody CloudFoundryResource<ServiceInstance> createServiceInstanceFromServicePlan(@RequestBody ServiceInstance instance) {
    	String token = userRepository.login();
		return restRepository.save(token, V2_SERVICE_INSTANCES.concat("?accepts_incomplete=true"), new CloudFoundryResource<ServiceInstance>(instance));
    }
    
}
