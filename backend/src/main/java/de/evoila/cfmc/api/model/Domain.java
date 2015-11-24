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
public class Domain {
	
	@JsonProperty("name")
	private String name;
	
	@JsonProperty("owning_organization_guid")
	private UUID owningOrganizationGuid;
	
	@JsonProperty("owning_organization_url")
	private String owningOrganizationUrl;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public UUID getOwningOrganizationGuid() {
		return owningOrganizationGuid;
	}

	public void setOwningOrganizationGuid(UUID owningOrganizationGuid) {
		this.owningOrganizationGuid = owningOrganizationGuid;
	}

	public String getOwningOrganizationUrl() {
		return owningOrganizationUrl;
	}

	public void setOwningOrganizationUrl(String owningOrganizationUrl) {
		this.owningOrganizationUrl = owningOrganizationUrl;
	}

	
}
