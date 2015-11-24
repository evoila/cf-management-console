/**
 * 
 */
package de.evoila.cfmc.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 
 * @author Johannes Hiemer
 *
 */
public class UserSession {

	@JsonProperty("user_id")
    private String id;

	@JsonProperty("user_name")
    private String userName;

	@JsonProperty("email")
    private String email;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

}
