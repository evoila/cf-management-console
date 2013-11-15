/**
 * 
 */
package com.github.styx.api.pivotal.cloudfoundry;

import java.util.List;
import java.util.UUID;

import org.cloudfoundry.client.lib.domain.ApplicationStats;
import org.cloudfoundry.client.lib.domain.CloudApplication;
import org.cloudfoundry.client.lib.domain.CloudDomain;
import org.cloudfoundry.client.lib.domain.CloudInfo;
import org.cloudfoundry.client.lib.domain.CloudOrganization;
import org.cloudfoundry.client.lib.domain.CloudRoute;
import org.cloudfoundry.client.lib.domain.CloudService;
import org.cloudfoundry.client.lib.domain.CloudSpace;
import org.cloudfoundry.client.lib.domain.InstancesInfo;
import org.cloudfoundry.client.lib.domain.Staging;
import org.springframework.stereotype.Service;

import com.github.styx.api.pivotal.CloudFoundryFactory;


/**
 * @author Johannes Hiemer.
 *
 */
@Service
public class CloudFoundry extends CloudFoundryFactory {
	
	public void initialize() throws Exception {
		if (client == null) {
			throw new IllegalAccessError("Client not initialized properly");
		}
	}
	
	public List<CloudSpace> getSpaces() {
		return client.getSpaces();
	}
	
	public CloudSpace getSpace(String spaceName) {
		List<CloudSpace> cloudSpaces = this.getSpaces();
		for (CloudSpace cloudSpace : cloudSpaces) {
			if (cloudSpace.getName().equals(spaceName)) 
				return cloudSpace;
		}
		return null;
	}
	
	public List<CloudOrganization> getOrganisations() {
		return client.getOrganizations();
	}
	
	public CloudOrganization getOrganisation(String id) {
		for (CloudOrganization cloudOrganization : getOrganisations()) {
			if (cloudOrganization.getMeta().getGuid().equals(UUID.fromString(id)))
				return cloudOrganization;
		}
		return null;
	}
	
	public List<CloudService> getServices() {
		return client.getServices();
	}
	
	public CloudService getService(String serviceName) {
		return client.getService(serviceName);
	}
	
	public int[] applicationMemoryChoices() {
		return client.getApplicationMemoryChoices();
	}
	
	public ApplicationStats applicationStats(String applicationName) {
		return client.getApplicationStats(applicationName);
	}
	
	public InstancesInfo applicationInstances(String applicationName) {
		return client.getApplicationInstances(applicationName);
	}
	
	public List<CloudApplication> getApplications() {
		return client.getApplications();
	}
	
	public void startApplication(String applicatName) {
		client.startApplication(applicatName);
	}
	
	public void stopApplication(String applicatName) {
		client.stopApplication(applicatName);
	}
	
	public void restartApplication(String applicatName) {
		client.restartApplication(applicatName);
	}
	
	public CloudApplication getApplication(String applicationName) {
		return client.getApplication(applicationName);
	}
	
	public void createApplication(String applicationName, Staging staging, 
			int memory, List<String> uris, List<String> serviceNames, String applicationPlan, 
			boolean checkExists) {
		client.createApplication(applicationName, staging, memory, uris, serviceNames);
	}
	
	public void deleteApplication(String applicationName) {
		client.deleteApplication(applicationName);
	}
	
	public void createDomain(String name) {
		client.addDomain(name);
	}
	
	public List<CloudDomain> getDomains() {
		return client.getDomainsForOrg();
	}
	
	public CloudDomain getDomain(String name) {
		List<CloudDomain> cloudDomains = this.getDomains();
		for (CloudDomain cloudDomain : cloudDomains) {
			if (cloudDomain.getName().equals(name))
				return cloudDomain;
		}
		return null;
	}
	
	public void deleteDomain(String name) {
		if (getDomain(name) != null)
			client.deleteDomain(name);
	}
	
	public void createRoute(String name, String domainName) {
		if (this.getDomain(domainName) != null && name != null)
			client.addRoute(name, domainName);
		else
			throw new IllegalArgumentException();
	}
	
	public CloudRoute getRoute(String name, String domainName) {
		List<CloudRoute> cloudRoutes = this.getRoutes(domainName);
		for (CloudRoute cloudRoute : cloudRoutes) {
			if (cloudRoute.getName().equals(name))
				return cloudRoute;
		}
		return null;
	}
	
	public List<CloudRoute> getRoutes(String domainName) {
		return client.getRoutes(domainName);
	}
	
	public CloudInfo getCloudInfo() {
		return client.getCloudInfo();
	}
	
}
