/**
 * 
 */
package de.evoila.cfmc.controllers;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import de.evoila.cfmc.api.model.Service;
import de.evoila.cfmc.api.model.ServiceInstance;
import de.evoila.cfmc.api.model.ServicePlan;
import de.evoila.cfmc.api.model.base.CloudFoundryResource;
import de.evoila.cfmc.api.model.base.CloudFoundryResources;
import de.evoila.cfmc.api.repositories.RestRepository;
import de.evoila.cfmc.api.repositories.UserRepository;

/**
 * 
 * @author Johannes Hiemer.
 *
 */
@RestController
@RequestMapping("/api")
public class ServiceController {

	@Autowired
    private RestRepository restRepository;
	
	@Autowired
    private UserRepository userRepository;
	
	private static String V2_SERVICES = "v2/services";
	private static String V2_SERVICE_PLANS = "v2/service_plans/";
	private static String V2_SERVICE_INSTANCES = "v2/service_instances";
	private static String V2_SERVICE_BINDINGS = "v2/service_bindings";
	
	
    @RequestMapping(value = "/services", method = GET)
    public @ResponseBody List<CloudFoundryResource<Service>> getServices(@RequestHeader("Authorization") String token) {
    	String adminToken = userRepository.login();
        CloudFoundryResources<Service> services = restRepository.list(adminToken, V2_SERVICES, 1, true);
        return services.getResources();
    }
    
    @RequestMapping(value = "/services/{serviceId}", method = RequestMethod.GET)
    public @ResponseBody CloudFoundryResource<Service> getServiceById(@RequestHeader("Authorization") final String token, 
    		@PathVariable("serviceId") final String serviceId) {
    	String adminToken = userRepository.login();
    	return restRepository.one(adminToken, V2_SERVICES, serviceId, 1);
    }
    
    @RequestMapping(value = "/services", method = RequestMethod.POST)
    public @ResponseBody CloudFoundryResource<Service> createService(@RequestHeader("Authorization") String token, 
    		@RequestBody Service service) {
    	String adminToken = userRepository.login();
        return restRepository.save(adminToken, V2_SERVICES, new CloudFoundryResource<Service>(service));
    }
    
    @RequestMapping(value = "/services/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteServiceById(@RequestHeader("Authorization") final String token, @PathVariable("id") final String id) {
    	restRepository.delete(token, V2_SERVICES, id);
    	return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @RequestMapping(value = "/services/{id}/service_plans", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<ServicePlan>> getServicePlansForService(@RequestHeader("Authorization") String token, 
    		@PathVariable("id") final String id) {
    	String adminToken = userRepository.login();
    	CloudFoundryResources<ServicePlan> servicePlans = restRepository.list(adminToken, V2_SERVICES.concat("/").concat(id).concat("/service_plans"), 1, true);
    	return servicePlans.getResources();
    }
  
    @RequestMapping(value = "/service_instances{filter}", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<ServiceInstance>> getServiceInstancesForFilter(@RequestHeader("Authorization") String token,
    		@PathVariable("filter") final String filter) {
    	String adminToken = userRepository.login();
    	CloudFoundryResources<ServiceInstance> serviceInstances = restRepository.list(adminToken, V2_SERVICE_INSTANCES.concat(filter), 1, true);
    	return serviceInstances.getResources();
    }
    
    @RequestMapping(value = "/service_instances/{instanceId}", method = RequestMethod.GET)
    public @ResponseBody CloudFoundryResource<ServiceInstance> getServiceInstancesForId(@RequestHeader("Authorization") String token,
    		@PathVariable("instanceId") final String instanceId) {
    	String adminToken = userRepository.login();
    	CloudFoundryResource<ServiceInstance> serviceInstance = restRepository.one(adminToken, V2_SERVICE_INSTANCES, instanceId, 1);
    	return serviceInstance;
    }
    
    @RequestMapping(value = "/service_plans/{planId}/service_instances", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<ServiceInstance>> getServiceInstancesForServicePlan(@RequestHeader("Authorization") String token,
    		@PathVariable("planId") final String planId) {
    	String adminToken = userRepository.login();
    	CloudFoundryResources<ServiceInstance> serviceInstances = restRepository.list(adminToken, V2_SERVICE_PLANS.concat(planId).concat("/service_instances"), 1, true);
    	return serviceInstances.getResources();
    }
        
    @RequestMapping(value = "/service_instances", method = RequestMethod.POST)
    public @ResponseBody CloudFoundryResource<ServiceInstance> createServiceInstanceFromServicePlan(@RequestHeader("Authorization") String token,
    		@RequestBody ServiceInstance instance) {
    	String adminToken = userRepository.login();
		return restRepository.save(adminToken, V2_SERVICE_INSTANCES.concat("?accepts_incomplete=true"), new CloudFoundryResource<ServiceInstance>(instance));
    }
    
    @RequestMapping(value = "/service_instances/{instanceId}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteServiceInstanceById(@RequestHeader("Authorization") final String token, 
    		@PathVariable("instanceId") final String instanceId) {
    	restRepository.delete(token, V2_SERVICE_INSTANCES, instanceId);
    	return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @RequestMapping(value = "/service_bindings/{bindingId}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteServiceBindingById(@RequestHeader("Authorization") final String token,
    		@PathVariable("bindingId") final String bindingId) {
    	restRepository.delete(token, V2_SERVICE_BINDINGS, bindingId);
    	return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
