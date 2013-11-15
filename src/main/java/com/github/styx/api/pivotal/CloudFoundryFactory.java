	/**
 * 
 */
package com.github.styx.api.pivotal;

import java.net.URI;
import java.net.URL;

import org.cloudfoundry.client.lib.CloudCredentials;
import org.cloudfoundry.client.lib.CloudFoundryClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;

/**
 * @author Johannes Hiemer.
 *
 */
public abstract class CloudFoundryFactory {
	
	protected Logger log = LoggerFactory.getLogger(CloudFoundryFactory.class);
	
	protected CloudFoundryClient client;

	/**
	 * @param host
	 * @param user
	 * @param password
	 * @throws BadCredentialsException
	 */
	public void setCredentials(String host, String user, String password)
			throws BadCredentialsException  {
		
		CloudCredentials credentials = new CloudCredentials(user, password);
        client = new CloudFoundryClient(credentials, getTargetURL(host));
        client.login();
		
	}
	
	/**
	 * @param target
	 * @return
	 * @throws BadCredentialsException
	 */
	private static URL getTargetURL(String target) throws BadCredentialsException {
        try {
            return new URI(target).toURL();
        } catch (Exception e) {
            throw new BadCredentialsException("Provided URL is malformed");
        }
    }
	
}
