/**
 * 
 */
package com.github.cfmc.api.model;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author johanneshiemer
 *
 */
public class Instance {
	
	private String state;
    
	private double since;
    
    @JsonProperty("debug_ip")
    private String debugIp;
        
    @JsonProperty("debug_port")
    private int debugPort;
    
    @JsonProperty("console_ip")
    private String consoleIp;
    
    @JsonProperty("console_port")
    private int consolePort;
    
    @JsonProperty("guid")
    private UUID guid;

    @JsonProperty("url")
    private String url;
    
    @JsonProperty("created_at")
    private String created_at;
    
	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public double getSince() {
		return since;
	}

	public void setSince(double since) {
		this.since = since;
	}

	public String getDebugIp() {
		return debugIp;
	}

	public void setDebugIp(String debugIp) {
		this.debugIp = debugIp;
	}

	public int getDebugPort() {
		return debugPort;
	}

	public void setDebugPort(int debugPort) {
		this.debugPort = debugPort;
	}

	public String getConsoleIp() {
		return consoleIp;
	}

	public void setConsoleIp(String consoleIp) {
		this.consoleIp = consoleIp;
	}

	public int getConsolePort() {
		return consolePort;
	}

	public void setConsolePort(int consolePort) {
		this.consolePort = consolePort;
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

	public String getCreated_at() {
		return created_at;
	}

	public void setCreated_at(String created_at) {
		this.created_at = created_at;
	}
    
}
