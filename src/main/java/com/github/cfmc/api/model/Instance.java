/**
 * 
 */
package com.github.cfmc.api.model;

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
    
}
