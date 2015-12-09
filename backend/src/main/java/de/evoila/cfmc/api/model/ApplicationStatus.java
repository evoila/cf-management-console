package de.evoila.cfmc.api.model;

/**
 * 
 * @author Tobias Siegl
 *
 */
public class ApplicationStatus {

	private String state;
	
	private ApplicationInstanceStats stats;

	
	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public ApplicationInstanceStats getStats() {
		return stats;
	}

	public void setStats(ApplicationInstanceStats stats) {
		this.stats = stats;
	}
}
