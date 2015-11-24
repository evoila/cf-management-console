/**
 * 
 */
package de.evoila.cfmc.api.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 
 * @author Johannes Hiemer
 *
 */
@JsonIgnoreProperties(ignoreUnknown=true)
public class UserInfo {

	@JsonProperty("id")
    private String id;

	@JsonProperty("meta")
    private Meta meta;
    
	@JsonProperty("userName")
    private String userName;
    
	@JsonProperty("emails")
    private List<Email> emails;
    
	@JsonProperty("groups")
    private List<Group> groups;
    
	@JsonProperty("approvals")
    private List<Approval> approvals;
    
	@JsonProperty("active")
    private boolean active;
    
	@JsonProperty("verified")
    private boolean verified;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Meta getMeta() {
		return meta;
	}

	public void setMeta(Meta meta) {
		this.meta = meta;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public List<Email> getEmails() {
		return emails;
	}

	public void setEmails(List<Email> emails) {
		this.emails = emails;
	}

	public List<Group> getGroups() {
		return groups;
	}

	public void setGroups(List<Group> groups) {
		this.groups = groups;
	}

	public List<Approval> getApprovals() {
		return approvals;
	}

	public void setApprovals(List<Approval> approvals) {
		this.approvals = approvals;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public boolean isVerified() {
		return verified;
	}

	public void setVerified(boolean verified) {
		this.verified = verified;
	}
	
}
