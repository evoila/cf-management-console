/**
 * 
 */
package de.evoila.cfmc.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * 
 * @author Johannes Hiemer.
 *
 */
@Controller
public class IndexController {

    @RequestMapping(value = {"/", ""}, method = RequestMethod.GET)
    public String getIndex(){
        return "index";
    }

}
