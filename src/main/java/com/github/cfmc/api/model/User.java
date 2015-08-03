/**
 * 
 */
package com.github.cfmc.api.model;

/**
 * 
 * @author Johannes Hiemer.
 *
 */
public abstract class User {

    private final String id;
    
    private String username;
    
    private final boolean isManager;
    
    private final boolean isAuditor;

    public User(final String id, final String username, final boolean manager, final boolean auditor) {
        this.id = id;
        this.username = username;
        isManager = manager;
        isAuditor = auditor;
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username){
        this.username = username;
    }

    public boolean isManager() {
        return isManager;
    }

    public boolean isAuditor() {
        return isAuditor;
    }
}
