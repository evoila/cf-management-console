package com.github.cfmc.api.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.github.cfmc.api.model.base.CloudFoundryResources;

/**
 * 
 * @author Johannes Hiemer
 * 
 */
public class Service {

	@JsonProperty("label")
	private String label;

	@JsonProperty("provider")
	private String provider;

	@JsonProperty("url")
	private String url;

	@JsonProperty("description")
	private String description;

	@JsonProperty("long_description")
	private String longDescription;

	@JsonProperty("version")
	private String version;

	@JsonProperty("info_url")
	private String infoUrl;

	@JsonProperty("active")
	private boolean active;

	@JsonProperty("bindable")
	private boolean bindable;

	@JsonProperty("unique_id")
	private String uniqueId;

	@JsonProperty("extra")
	private Object extra;
	
	@JsonProperty("tags")
	private List<String> tags;
	
	@JsonProperty("requires")
	private List<String> requires;
	
	@JsonProperty("documentation_url")
	private String documationUrl;
	
	@JsonProperty("service_plans_url")
	private String servicePlanUrl;
	
	@JsonProperty("service_plans")
	private CloudFoundryResources<ServicePlan> servicePlans;

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getProvider() {
		return provider;
	}

	public void setProvider(String provider) {
		this.provider = provider;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getLongDescription() {
		return longDescription;
	}

	public void setLongDescription(String longDescription) {
		this.longDescription = longDescription;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getInfoUrl() {
		return infoUrl;
	}

	public void setInfoUrl(String infoUrl) {
		this.infoUrl = infoUrl;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public boolean isBindable() {
		return bindable;
	}

	public void setBindable(boolean bindable) {
		this.bindable = bindable;
	}

	public String getUniqueId() {
		return uniqueId;
	}

	public void setUniqueId(String uniqueId) {
		this.uniqueId = uniqueId;
	}

	public Object getExtra() {
		return extra;
	}

	public void setExtra(Object extra) {
		this.extra = extra;
	}

	public List<String> getTags() {
		return tags;
	}

	public void setTags(List<String> tags) {
		this.tags = tags;
	}

	public List<String> getRequires() {
		return requires;
	}

	public void setRequires(List<String> requires) {
		this.requires = requires;
	}

	public String getDocumationUrl() {
		return documationUrl;
	}

	public void setDocumationUrl(String documationUrl) {
		this.documationUrl = documationUrl;
	}

	public String getServicePlanUrl() {
		return servicePlanUrl;
	}

	public void setServicePlanUrl(String servicePlanUrl) {
		this.servicePlanUrl = servicePlanUrl;
	}

	public CloudFoundryResources<ServicePlan> getServicePlans() {
		return servicePlans;
	}

	public void setServicePlans(CloudFoundryResources<ServicePlan> servicePlans) {
		this.servicePlans = servicePlans;
	}
	
}
