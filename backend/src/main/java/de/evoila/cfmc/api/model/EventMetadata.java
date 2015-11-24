/**
 * 
 */
package de.evoila.cfmc.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author Johannes Hiemer.
 *
 */
public class EventMetadata {
	
	@JsonProperty("request")
	private EventRequest request;

	public EventRequest getRequest() {
		return request;
	}

	public void setRequest(EventRequest request) {
		this.request = request;
	}
	
}
