package de.evoila.cfmc.api.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * 
 * @author Tobias Siegl
 *
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class ApplicationInstanceUsage {
	
	private String time;
	
	private double cpu;
	
	private double mem;
	
	private double disk;
	

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public double getCpu() {
		return cpu;
	}

	public void setCpu(double cpu) {
		this.cpu = cpu;
	}

	public double getMem() {
		return mem;
	}

	public void setMem(double mem) {
		this.mem = mem;
	}

	public double getDisk() {
		return disk;
	}

	public void setDisk(double disk) {
		this.disk = disk;
	}

}
