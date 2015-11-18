/**
 * 
 */
package com.github.cfmc.api.model;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.github.cfmc.api.model.base.CloudFoundryResources;


/**
 * 
 * @author Johannes Hiemer.
 *
 */
@JsonIgnoreProperties
public class Summary {

	@JsonProperty("name")
	private String name;
	
	@JsonProperty("guid")
	private UUID guid;
		
	@JsonProperty("apps")
	private CloudFoundryResources<Application> apps;
	
	@JsonProperty("services")
	private CloudFoundryResources<Service> services;
	
		public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public UUID getGuid() {
		return guid;
	}
	
	public void setGuid(UUID guid) {
		this.guid = guid;
	}

	public CloudFoundryResources<Application> getApps() {
		return apps;
	}

	public void setApps(CloudFoundryResources<Application> apps) {
		this.apps = apps;
	}

	public CloudFoundryResources<Service> getServices() {
		return services;
	}

	public void setServices(CloudFoundryResources<Service> services) {
		this.services = services;
	}

}
