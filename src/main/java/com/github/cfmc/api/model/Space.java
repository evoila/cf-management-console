/**
 * 
 */
package com.github.cfmc.api.model;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.github.cfmc.api.model.base.CloudFoundryResources;


/**
 * 
 * @author Johannes Hiemer.
 *
 */
public class Space {

	@JsonProperty("name")
	private String name;
	
	@JsonProperty("organization_guid")
	private UUID organizationGuid;
	
	@JsonProperty("organization_url")
	private String organizationUrl;
	
	@JsonProperty("developers_url")
	private String developersUrl;
	
	@JsonProperty("managers_url")
	private String managersUrl;
	
	@JsonProperty("auditors_url")
	private String auditorsUrl;
	
	@JsonProperty("apps_url")
	private String appsUrl;
	
	@JsonProperty("domains_url")
	private String domainsUrl;
	
	@JsonProperty("service_instances_url")
	private String serviceInstancesUrl;
	
	@JsonProperty("app_events_url")
	private String appEventsUrl;
	
	@JsonProperty("events_url")
	private String eventsUrl;
	
	@JsonProperty("apps")
	private CloudFoundryResources<Application> apps;
	
	@JsonProperty("domains")
	private CloudFoundryResources<Domain> domains;
	
	@JsonProperty("events")
	private CloudFoundryResources<Event> events;
	
	@JsonProperty("developers")
	private CloudFoundryResources<SpaceUser> developers;
	
	@JsonProperty("managers")
	private CloudFoundryResources<SpaceUser> managers;
	
	@JsonProperty("auditors")
	private CloudFoundryResources<SpaceUser> auditors;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public UUID getOrganizationGuid() {
		return organizationGuid;
	}

	public void setOrganizationGuid(UUID organizationGuid) {
		this.organizationGuid = organizationGuid;
	}

	public String getOrganizationUrl() {
		return organizationUrl;
	}

	public void setOrganizationUrl(String organizationUrl) {
		this.organizationUrl = organizationUrl;
	}

	public String getDevelopersUrl() {
		return developersUrl;
	}

	public void setDevelopersUrl(String developersUrl) {
		this.developersUrl = developersUrl;
	}

	public String getManagersUrl() {
		return managersUrl;
	}

	public void setManagersUrl(String managersUrl) {
		this.managersUrl = managersUrl;
	}

	public String getAuditorsUrl() {
		return auditorsUrl;
	}

	public void setAuditorsUrl(String auditorsUrl) {
		this.auditorsUrl = auditorsUrl;
	}

	public String getAppsUrl() {
		return appsUrl;
	}

	public void setAppsUrl(String appsUrl) {
		this.appsUrl = appsUrl;
	}

	public String getDomainsUrl() {
		return domainsUrl;
	}

	public void setDomainsUrl(String domainsUrl) {
		this.domainsUrl = domainsUrl;
	}

	public String getServiceInstancesUrl() {
		return serviceInstancesUrl;
	}

	public void setServiceInstancesUrl(String serviceInstancesUrl) {
		this.serviceInstancesUrl = serviceInstancesUrl;
	}

	public String getAppEventsUrl() {
		return appEventsUrl;
	}

	public void setAppEventsUrl(String appEventsUrl) {
		this.appEventsUrl = appEventsUrl;
	}

	public String getEventsUrl() {
		return eventsUrl;
	}

	public void setEventsUrl(String eventsUrl) {
		this.eventsUrl = eventsUrl;
	}

	public CloudFoundryResources<Application> getApps() {
		return apps;
	}

	public void setApps(CloudFoundryResources<Application> apps) {
		this.apps = apps;
	}

	public CloudFoundryResources<Domain> getDomains() {
		return domains;
	}

	public void setDomains(CloudFoundryResources<Domain> domains) {
		this.domains = domains;
	}

	public CloudFoundryResources<Event> getEvents() {
		return events;
	}

	public void setEvents(CloudFoundryResources<Event> events) {
		this.events = events;
	}

	public CloudFoundryResources<SpaceUser> getDevelopers() {
		return developers;
	}

	public void setDevelopers(CloudFoundryResources<SpaceUser> developers) {
		this.developers = developers;
	}

	public CloudFoundryResources<SpaceUser> getManagers() {
		return managers;
	}

	public void setManagers(CloudFoundryResources<SpaceUser> managers) {
		this.managers = managers;
	}

	public CloudFoundryResources<SpaceUser> getAuditors() {
		return auditors;
	}

	public void setAuditors(CloudFoundryResources<SpaceUser> auditors) {
		this.auditors = auditors;
	}
	
}
