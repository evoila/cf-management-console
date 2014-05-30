/**
 * 
 */
package com.github.cfmc.api.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author Johannes Hiemer
 *
 */
public class Meta {
	
	@JsonProperty("version")
	private String version;
	
	@JsonProperty("created")
	private Date created;
	
	@JsonProperty("lastModified")
	private Date lastModified;

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public Date getCreated() {
		return created;
	}

	public void setCreated(Date created) {
		this.created = created;
	}

	public Date getLastModified() {
		return lastModified;
	}

	public void setLastModified(Date lastModified) {
		this.lastModified = lastModified;
	}
	
}
