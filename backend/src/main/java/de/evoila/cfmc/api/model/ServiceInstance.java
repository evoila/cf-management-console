/**
 * 
 */
package de.evoila.cfmc.api.model;

import java.util.UUID;


import com.fasterxml.jackson.annotation.JsonProperty;


/**
 * 
 * @author Johannes Hiemer.
 *
 */
public class ServiceInstance {

	@JsonProperty("name")
	private String name;
	
	@JsonProperty("space_guid")
	private UUID spaceGuid;
	
	@JsonProperty("space_url")
	private String spaceUrl;
	
	@JsonProperty("service_plan_guid")
	private UUID servicePlanGuid;
	
	@JsonProperty("service_plan_url")
	private String servicePlanUrl;
	
	@JsonProperty("service_bindings_url")
	private String serviceBindingUrl;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public UUID getSpaceGuid() {
		return spaceGuid;
	}

	public void setSpaceGuid(UUID spaceGuid) {
		this.spaceGuid = spaceGuid;
	}

	public String getSpaceUrl() {
		return spaceUrl;
	}

	public void setSpaceUrl(String spaceUrl) {
		this.spaceUrl = spaceUrl;
	}

	public UUID getServicePlanGuid() {
		return servicePlanGuid;
	}

	public void setServicePlanGuid(UUID servicePlanGuid) {
		this.servicePlanGuid = servicePlanGuid;
	}

	public String getServicePlanUrl() {
		return servicePlanUrl;
	}

	public void setServicePlanUrl(String servicePlanUrl) {
		this.servicePlanUrl = servicePlanUrl;
	}

	public String getServiceBindingUrl() {
		return serviceBindingUrl;
	}

	public void setServiceBindingUrl(String serviceBindingUrl) {
		this.serviceBindingUrl = serviceBindingUrl;
	}
	
}
