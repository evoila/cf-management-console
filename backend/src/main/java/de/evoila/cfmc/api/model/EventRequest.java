/**
 * 
 */
package de.evoila.cfmc.api.model;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author Johannes Hiemer.
 *
 */
public class EventRequest {
	
	@JsonProperty("space_guid")
	private UUID spaceGuid;
	
	@JsonProperty("name")
	private String name;
	
	@JsonProperty("instances")
	private int instances;
	
	@JsonProperty("memory")
	private int memory;
	
	@JsonProperty("production")
	private boolean production;
	
	@JsonProperty("environment_json")
	private String environmentJson;
	
	@JsonProperty("disk_quota")	
	private int diskQuota;
	
	@JsonProperty("state")
	private String state;
	
	@JsonProperty("console")
	private boolean console;

	public UUID getSpaceGuid() {
		return spaceGuid;
	}

	public void setSpaceGuid(UUID spaceGuid) {
		this.spaceGuid = spaceGuid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getInstances() {
		return instances;
	}

	public void setInstances(int instances) {
		this.instances = instances;
	}

	public int getMemory() {
		return memory;
	}

	public void setMemory(int memory) {
		this.memory = memory;
	}

	public boolean isProduction() {
		return production;
	}

	public void setProduction(boolean production) {
		this.production = production;
	}

	public String getEnvironmentJson() {
		return environmentJson;
	}

	public void setEnvironmentJson(String environmentJson) {
		this.environmentJson = environmentJson;
	}

	public int getDiskQuota() {
		return diskQuota;
	}

	public void setDiskQuota(int diskQuota) {
		this.diskQuota = diskQuota;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public boolean isConsole() {
		return console;
	}

	public void setConsole(boolean console) {
		this.console = console;
	}
	
}
