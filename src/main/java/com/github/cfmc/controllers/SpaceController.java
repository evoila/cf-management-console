/**
 * 
 */
package com.github.cfmc.controllers;

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

import com.github.cfmc.api.model.Space;
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
public class SpaceController {

	@Autowired
    private RestRepository restRepository;
	
	private static final String V2_SPACES = "v2/spaces";

    @RequestMapping(value = "/spaces/{id}", method = RequestMethod.GET)
    public @ResponseBody CloudFoundryResource<Space> getSpaceById(@RequestHeader("Authorization") final String token, @PathVariable("id") final String id) {
    	CloudFoundryResource<Space> space = restRepository.one(token, V2_SPACES, id, 2);
    	
    	return space;
    }

    @RequestMapping(value = "/organizations/{id}/spaces", method = RequestMethod.GET)
    public @ResponseBody List<CloudFoundryResource<Space>> getSpacesByOrganizationId(@RequestHeader("Authorization") final String token, 
    		@PathVariable("id") final String id) {
    	CloudFoundryResources<Space> spaces =  restRepository.list(token, "v2/organizations/".concat(id).concat("/spaces"), 2);
    	return spaces.getResources();
    }

    @RequestMapping(value = "/spaces", method = RequestMethod.POST)
    public @ResponseBody CloudFoundryResource<Space> createSpace(@RequestHeader("Authorization") String token, 
    		@RequestBody Space space) {
        return restRepository.save(token, V2_SPACES, new CloudFoundryResource<Space>(space));
    }
    
    @RequestMapping(value = "/spaces/{id}", method = RequestMethod.PUT)
    public @ResponseBody CloudFoundryResource<Space> updateSpace(@RequestHeader("Authorization") String token, @PathVariable("id") String id, 
    		@RequestBody CloudFoundryResource<Space> space) {
    	 return restRepository.update(token, V2_SPACES.concat(id).concat("?collection-method=add"), space);
    }

    @RequestMapping(value = "/spaces/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> deleteSpaceById(@RequestHeader("Authorization") final String token, @PathVariable("id") final String id) {
    	restRepository.delete(token, V2_SPACES, id);
    	return new ResponseEntity<>(HttpStatus.OK);
    }

}
