package de.evoila.cfmc.api.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 
 * @author Tobias Siegl
 *
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class ApplicationInstanceStats {

	private String name;
	
	private String[] uris;
	
	private String host;
	
	private Integer port;
	
	private double uptime;
	
	@JsonProperty("mem_quota")
	private double memQuota;
	
	@JsonProperty("disk_quota")
	private double diskQuota;
	
	@JsonProperty("fds_quota")
	private double fdsQuota;
	
	private ApplicationInstanceUsage usage;
	

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String[] getUris() {
		return uris;
	}

	public void setUris(String[] uris) {
		this.uris = uris;
	}

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public Integer getPort() {
		return port;
	}

	public void setPort(Integer port) {
		this.port = port;
	}

	public double getUptime() {
		return uptime;
	}

	public void setUptime(double uptime) {
		this.uptime = uptime;
	}

	public double getMemQuota() {
		return memQuota;
	}

	public void setMemQuota(double memQuota) {
		this.memQuota = memQuota;
	}

	public double getDiskQuota() {
		return diskQuota;
	}

	public void setDiskQuota(double diskQuota) {
		this.diskQuota = diskQuota;
	}

	public double getFdsQuota() {
		return fdsQuota;
	}

	public void setFdsQuota(double fdsQuota) {
		this.fdsQuota = fdsQuota;
	}

	public ApplicationInstanceUsage getUsage() {
		return usage;
	}

	public void setUsage(ApplicationInstanceUsage usage) {
		this.usage = usage;
	}
}
