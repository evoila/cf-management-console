/**
 * 
 */
package de.evoila.cfmc.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author Johannes Hiemer
 *
 */
public class Group {
	
	@JsonProperty("value")
	private String value;
	
	@JsonProperty("display")
	private String display;
	
	@JsonProperty("type")
	private String type;

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getDisplay() {
		return display;
	}

	public void setDisplay(String display) {
		this.display = display;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
}
