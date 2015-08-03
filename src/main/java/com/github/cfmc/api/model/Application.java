/**
 * 
 */
package com.github.cfmc.api.model;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;


/**
 * 
 * @author Johannes Hiemer.
 *
 */
public class Application {

	@JsonProperty("name")
	private String name;
	
	@JsonProperty("production")
	private boolean production;
	
	@JsonProperty("environment_json")
	private String environmentJson;
	
	@JsonProperty("memory")
	private int memory;
	
	@JsonProperty("instances")
	private int instances;
	
	@JsonProperty("file_descriptors")
	private int fileDescriptors;
	
	@JsonProperty("disk_quota")
	private int diskQuota;
	
	@JsonProperty("state")
	private String state;
	
	@JsonProperty("command")
	private String command;
	
	@JsonProperty("console")
	private boolean console;
	
	@JsonProperty("space_guid")
	private UUID spaceGuid;
	
	@JsonProperty("space_url")
	private String spaceUrl;
	
	@JsonProperty("runtime_guid")
	private UUID runtimeGuid;
	
	@JsonProperty("runtime_url")
	private String runtimeUrl;
	
	@JsonProperty("framework_guid")
	private UUID frameworkGuid;
	
	@JsonProperty("framework_url")
	private String frameworkUrl;
	
	@JsonProperty("service_bindings_url")
	private String serviceBindingUrl;
	
	@JsonProperty("routes_url")
	private String routeUrl;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	public int getMemory() {
		return memory;
	}

	public void setMemory(int memory) {
		this.memory = memory;
	}

	public int getInstances() {
		return instances;
	}

	public void setInstances(int instances) {
		this.instances = instances;
	}

	public int getFileDescriptors() {
		return fileDescriptors;
	}

	public void setFileDescriptors(int fileDescriptors) {
		this.fileDescriptors = fileDescriptors;
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

	public String getCommand() {
		return command;
	}

	public void setCommand(String command) {
		this.command = command;
	}

	public boolean isConsole() {
		return console;
	}

	public void setConsole(boolean console) {
		this.console = console;
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

	public UUID getRuntimeGuid() {
		return runtimeGuid;
	}

	public void setRuntimeGuid(UUID runtimeGuid) {
		this.runtimeGuid = runtimeGuid;
	}

	public String getRuntimeUrl() {
		return runtimeUrl;
	}

	public void setRuntimeUrl(String runtimeUrl) {
		this.runtimeUrl = runtimeUrl;
	}

	public UUID getFrameworkGuid() {
		return frameworkGuid;
	}

	public void setFrameworkGuid(UUID frameworkGuid) {
		this.frameworkGuid = frameworkGuid;
	}

	public String getFrameworkUrl() {
		return frameworkUrl;
	}

	public void setFrameworkUrl(String frameworkUrl) {
		this.frameworkUrl = frameworkUrl;
	}

	public String getServiceBindingUrl() {
		return serviceBindingUrl;
	}

	public void setServiceBindingUrl(String serviceBindingUrl) {
		this.serviceBindingUrl = serviceBindingUrl;
	}

	public String getRouteUrl() {
		return routeUrl;
	}

	public void setRouteUrl(String routeUrl) {
		this.routeUrl = routeUrl;
	}
	
}
