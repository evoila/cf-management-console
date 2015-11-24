package de.evoila.cfmc.api.model;

import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 
 * @author Johannes Hiemer.
 *
 */
public class SpaceUser {
	
	@JsonProperty("admin")
	private boolean admin;
	
	@JsonProperty("active")
	private boolean active;
	
	@JsonProperty("default_space_guid")
	private UUID defaultSpaceGuid;
	
	@JsonProperty("spaces_url")
	private String spacesUrl;
	
	@JsonProperty("organizations_url")
	private String organizationsUrl;
	
	@JsonProperty("managed_organizations_url")
	private String managedOrganizationUrl;
	
	@JsonProperty("billing_managed_organizations_url")
	private String billingManagetOrganizationUrl;
	
	@JsonProperty("audited_organizations_url")
	private String auditedOrganzationUrl;
	
	@JsonProperty("managed_spaces_url")
	private String managedSpacesUrl;
	
	@JsonProperty("audited_spaces_url")
	private String auditedSpacesUrl;

	public boolean isAdmin() {
		return admin;
	}

	public void setAdmin(boolean admin) {
		this.admin = admin;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public UUID getDefaultSpaceGuid() {
		return defaultSpaceGuid;
	}

	public void setDefaultSpaceGuid(UUID defaultSpaceGuid) {
		this.defaultSpaceGuid = defaultSpaceGuid;
	}

	public String getSpacesUrl() {
		return spacesUrl;
	}

	public void setSpacesUrl(String spacesUrl) {
		this.spacesUrl = spacesUrl;
	}

	public String getOrganizationsUrl() {
		return organizationsUrl;
	}

	public void setOrganizationsUrl(String organizationsUrl) {
		this.organizationsUrl = organizationsUrl;
	}

	public String getManagedOrganizationUrl() {
		return managedOrganizationUrl;
	}

	public void setManagedOrganizationUrl(String managedOrganizationUrl) {
		this.managedOrganizationUrl = managedOrganizationUrl;
	}

	public String getBillingManagetOrganizationUrl() {
		return billingManagetOrganizationUrl;
	}

	public void setBillingManagetOrganizationUrl(
			String billingManagetOrganizationUrl) {
		this.billingManagetOrganizationUrl = billingManagetOrganizationUrl;
	}

	public String getAuditedOrganzationUrl() {
		return auditedOrganzationUrl;
	}

	public void setAuditedOrganzationUrl(String auditedOrganzationUrl) {
		this.auditedOrganzationUrl = auditedOrganzationUrl;
	}

	public String getManagedSpacesUrl() {
		return managedSpacesUrl;
	}

	public void setManagedSpacesUrl(String managedSpacesUrl) {
		this.managedSpacesUrl = managedSpacesUrl;
	}

	public String getAuditedSpacesUrl() {
		return auditedSpacesUrl;
	}

	public void setAuditedSpacesUrl(String auditedSpacesUrl) {
		this.auditedSpacesUrl = auditedSpacesUrl;
	}
    
}
