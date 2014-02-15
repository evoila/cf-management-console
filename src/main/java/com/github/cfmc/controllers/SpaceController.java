/**
 * 
 */
package com.github.cfmc.controllers;

import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.cfmc.api.model.Space;
import com.github.cfmc.api.repositories.SpaceRepository;

/**
 * 
 * @author Johannes Hiemer.
 *
 */
@Controller
@RequestMapping("/api")
public class SpaceController {

	@Autowired
    private SpaceRepository spaceRepository;

    @RequestMapping(value = "/spaces", method = RequestMethod.POST)
   
    public @ResponseBody String createSpace(@RequestHeader("Authorization") String token, @RequestBody String body) {
        return spaceRepository.createSpace(token, body);
    }

    @RequestMapping(value = "/spaces/{id}", method = DELETE)
    public void deleteSpaceById(@RequestHeader("Authorization") final String token, @PathVariable("id") final String id) {
        spaceRepository.deleteById(token, id);
    }

    @RequestMapping(value = "/spaces/{id}", method = GET)
    public @ResponseBody Space getSpaceById(@RequestHeader("Authorization") final String token, @PathVariable("id") final String id) {
        return spaceRepository.getById(token, id);
    }

    @RequestMapping(value = "/organizations/{id}/spaces", method = GET)
    public @ResponseBody List<Space> getSpacesByOrganizationId(@RequestHeader("Authorization") final String token, @PathVariable("id") final String id) {
        return spaceRepository.getByOrganizationId(token, id);
    }

    @RequestMapping(value = "/spaces/{id}", method = RequestMethod.PUT)
    public @ResponseBody String updateSpace(@RequestHeader("Authorization") String token, @PathVariable("id") String id, @RequestBody String body) {
        return spaceRepository.updateSpace(token, id, body);
    }

}
