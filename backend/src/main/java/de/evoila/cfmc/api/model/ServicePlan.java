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
public class ServicePlan {

	@JsonProperty("name")
    private String name;
    
	@JsonProperty("free")
    private boolean free;
    
	@JsonProperty("description")
    private String description;
    
	@JsonProperty("service_guid")	
    private UUID serviceGuid;
    
	@JsonProperty("extra")
    private Object extra;
    
	@JsonProperty("unique_id")
    private String uniqueId;
    
	@JsonProperty("public")
    private boolean pub;
    
	@JsonProperty("service_url")
    private String serviceUrl;
    
	@JsonProperty("service_instances_url")
    private String serviceInstanceUrl;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public boolean isFree() {
		return free;
	}

	public void setFree(boolean free) {
		this.free = free;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public UUID getServiceGuid() {
		return serviceGuid;
	}

	public void setServiceGuid(UUID serviceGuid) {
		this.serviceGuid = serviceGuid;
	}

	public Object getExtra() {
		return extra;
	}

	public void setExtra(Object extra) {
		this.extra = extra;
	}

	public String getUniqueId() {
		return uniqueId;
	}

	public void setUniqueId(String uniqueId) {
		this.uniqueId = uniqueId;
	}

	public boolean isPub() {
		return pub;
	}

	public void setPub(boolean pub) {
		this.pub = pub;
	}

	public String getServiceUrl() {
		return serviceUrl;
	}

	public void setServiceUrl(String serviceUrl) {
		this.serviceUrl = serviceUrl;
	}

	public String getServiceInstanceUrl() {
		return serviceInstanceUrl;
	}

	public void setServiceInstanceUrl(String serviceInstanceUrl) {
		this.serviceInstanceUrl = serviceInstanceUrl;
	}
	
}
