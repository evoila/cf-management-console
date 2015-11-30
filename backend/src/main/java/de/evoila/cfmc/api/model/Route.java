/**
 * 
 */
package de.evoila.cfmc.api.model;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author Johannes Hiemer.
 *
 */
@JsonIgnoreProperties(ignoreUnknown=true)
public class Route {
	
	@JsonProperty("host")
	private String host;
	
	@JsonProperty("path")
	private String path;
	
	@JsonProperty("domain_guid")
	private UUID domainGuid;
	
	@JsonProperty("space_guid")
	private UUID spaceGuid;
	
	@JsonProperty("service_instance_guid")
	private UUID serviceInstanceGuid;
	
	@JsonProperty("space_url")
	private String spaceUrl;
	
	@JsonProperty("domain_url")
	private String domainUrl;
	
	@JsonProperty("service_instance_url")
	private String serviceInstanceUrl;
	
	@JsonProperty("apps_url")
	private String appsUrl;
	
	@JsonProperty("port")
	private Integer port;

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}
	
	public Integer getPort() {
		return port;
	}

	public void setPort(Integer port) {
		this.port = port;
	}

	public UUID getDomainGuid() {
		return domainGuid;
	}

	public void setDomainGuid(UUID domainGuid) {
		this.domainGuid = domainGuid;
	}

	public UUID getSpaceGuid() {
		return spaceGuid;
	}

	public void setSpaceGuid(UUID spaceGuid) {
		this.spaceGuid = spaceGuid;
	}

	public UUID getServiceInstanceGuid() {
		return serviceInstanceGuid;
	}

	public void setServiceInstanceGuid(UUID serviceInstanceGuid) {
		this.serviceInstanceGuid = serviceInstanceGuid;
	}

	public String getSpaceUrl() {
		return spaceUrl;
	}

	public void setSpaceUrl(String spaceUrl) {
		this.spaceUrl = spaceUrl;
	}

	public String getDomainUrl() {
		return domainUrl;
	}

	public void setDomainUrl(String domainUrl) {
		this.domainUrl = domainUrl;
	}

	public String getServiceInstanceUrl() {
		return serviceInstanceUrl;
	}

	public void setServiceInstanceUrl(String serviceInstanceUrl) {
		this.serviceInstanceUrl = serviceInstanceUrl;
	}

	public String getAppsUrl() {
		return appsUrl;
	}

	public void setAppsUrl(String appsUrl) {
		this.appsUrl = appsUrl;
	}

}
