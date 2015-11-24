/**
 * 
 */
package de.evoila.cfmc.api.model.base;

import java.util.Date;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author Johannes Hiemer.
 *
 */
public class CloudFoundryMetadata {

	@JsonProperty("guid")
	private UUID guid;
	
	@JsonProperty("url")
	private String url;
	
	@JsonProperty("created_at")
	private Date createdAt;
	
	@JsonProperty("updated_at")
	private Date updatedAt;
	
	public CloudFoundryMetadata() {
		super();
	}

	public CloudFoundryMetadata(UUID guid, String url, Date createdAt,
			Date updatedAt) {
		super();
		this.guid = guid;
		this.url = url;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	public UUID getGuid() {
		return guid;
	}

	public void setGuid(UUID guid) {
		this.guid = guid;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public Date getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Date updatedAt) {
		this.updatedAt = updatedAt;
	}
	
}
