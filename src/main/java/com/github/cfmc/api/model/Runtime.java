/**
 * 
 */
package com.github.cfmc.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author Johannes Hiemer,
 *
 */
public class Runtime {
	
	@JsonProperty("name")
	private String name;
	
	@JsonProperty("description")
	private String description;
	
	@JsonProperty("version")
	private String version;
	
	@JsonProperty("apps_url")
	private String appsUrl;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getAppsUrl() {
		return appsUrl;
	}

	public void setAppsUrl(String appsUrl) {
		this.appsUrl = appsUrl;
	}

}
