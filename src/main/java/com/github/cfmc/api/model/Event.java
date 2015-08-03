/**
 * 
 */
package com.github.cfmc.api.model;

import java.util.Date;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author Johannes Hiemer.
 *
 */
public class Event {
	
	@JsonProperty("type")
	private String type;
	
	@JsonProperty("actor")
	private UUID actor;
	
	@JsonProperty("actor_type")
	private String actorType;
	
	@JsonProperty("actee")
	private UUID actee;
	
	@JsonProperty("actee_type")
	private String acteeType;
	
	@JsonProperty("timestamp")
	private Date timestamp;
	
	@JsonProperty("metadata")
	private EventMetadata eventMetadata;
	
	@JsonProperty("space_guid")
	private UUID spaceGuid;
	
	@JsonProperty("organization_guid")
	private UUID organizationUUID;
	
	@JsonProperty("space_url")
	private String spaceUrl;

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public UUID getActor() {
		return actor;
	}

	public void setActor(UUID actor) {
		this.actor = actor;
	}

	public String getActorType() {
		return actorType;
	}

	public void setActorType(String actorType) {
		this.actorType = actorType;
	}

	public UUID getActee() {
		return actee;
	}

	public void setActee(UUID actee) {
		this.actee = actee;
	}

	public String getActeeType() {
		return acteeType;
	}

	public void setActeeType(String acteeType) {
		this.acteeType = acteeType;
	}

	public Date getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}

	public EventMetadata getEventMetadata() {
		return eventMetadata;
	}

	public void setEventMetadata(EventMetadata eventMetadata) {
		this.eventMetadata = eventMetadata;
	}

	public UUID getSpaceGuid() {
		return spaceGuid;
	}

	public void setSpaceGuid(UUID spaceGuid) {
		this.spaceGuid = spaceGuid;
	}

	public UUID getOrganizationUUID() {
		return organizationUUID;
	}

	public void setOrganizationUUID(UUID organizationUUID) {
		this.organizationUUID = organizationUUID;
	}

	public String getSpaceUrl() {
		return spaceUrl;
	}

	public void setSpaceUrl(String spaceUrl) {
		this.spaceUrl = spaceUrl;
	}

	
}
