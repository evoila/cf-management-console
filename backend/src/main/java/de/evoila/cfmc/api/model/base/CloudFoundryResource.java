/**
 * 
 */
package de.evoila.cfmc.api.model.base;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author Johannes Hiemer.
 *
 */
public class CloudFoundryResource<T> {
	
	@JsonProperty("metadata")
	public CloudFoundryMetadata metaData;
	
	@JsonProperty("entity")
	public T entity;
	
	public CloudFoundryResource() {
		
	}
	
	public CloudFoundryResource(T entity) {
		super();
		this.entity = entity;
	}
	
	public CloudFoundryResource(CloudFoundryMetadata metaData, T entity) {
		super();
		this.metaData = metaData;
		this.entity = entity;
	}

	public CloudFoundryMetadata getMetaData() {
		return metaData;
	}

	public void setMetaData(CloudFoundryMetadata metaData) {
		this.metaData = metaData;
	}

	public T getEntity() {
		return entity;
	}

	public void setEntity(T entity) {
		this.entity = entity;
	}
	
}
