/**
 * 
 */
package com.github.cfmc.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author Johannes Hiemer.
 *
 */
public class QuotaDefinition {

	@JsonProperty("name")
	private String name;
	
	@JsonProperty("non_basic_services_allowed")
	private boolean noneBasicServicesAllowed;
	
	@JsonProperty("total_services")
	private int totalServices;
	
	@JsonProperty("total_routes")
	private int totalRoutes;
	
	@JsonProperty("memory_limit")
	private int memoryLimit;
	
	@JsonProperty("trial_db_allowed")
	private boolean trialDbAllowed;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public boolean isNoneBasicServicesAllowed() {
		return noneBasicServicesAllowed;
	}

	public void setNoneBasicServicesAllowed(boolean noneBasicServicesAllowed) {
		this.noneBasicServicesAllowed = noneBasicServicesAllowed;
	}

	public int getTotalServices() {
		return totalServices;
	}

	public void setTotalServices(int totalServices) {
		this.totalServices = totalServices;
	}

	public int getTotalRoutes() {
		return totalRoutes;
	}

	public void setTotalRoutes(int totalRoutes) {
		this.totalRoutes = totalRoutes;
	}

	public int getMemoryLimit() {
		return memoryLimit;
	}

	public void setMemoryLimit(int memoryLimit) {
		this.memoryLimit = memoryLimit;
	}

	public boolean isTrialDbAllowed() {
		return trialDbAllowed;
	}

	public void setTrialDbAllowed(boolean trialDbAllowed) {
		this.trialDbAllowed = trialDbAllowed;
	}
	
}
