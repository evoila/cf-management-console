package de.evoila.cfmc.api.model;

import java.util.Map;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 
 * @author Tobias Siegl
 *
 */
public class ServiceBinding {
	
	@JsonProperty("app_guid")
	private UUID appGuid;
	
	@JsonProperty("service_instance_guid")
	private UUID serviceInstanceGuid;
	
	private Map<String,String> credentials;
	
	@JsonProperty("binding_options")
	private Map<String,String> bindingOptions;
	
	@JsonProperty("gateway_data")
	private String gatewayData;
	
	@JsonProperty("gateway_name")
	private String gatewayName;
	
	@JsonProperty("syslog_drain_url")
	private String syslogDrainUrl;
	
	@JsonProperty("app_url")
	private String appUrl;
	
	@JsonProperty("service_instance_url")
	private String serviceInstanceUrl;

	public UUID getAppGuid() {
		return appGuid;
	}

	public void setAppGuid(UUID appGuid) {
		this.appGuid = appGuid;
	}

	public UUID getServiceInstanceGuid() {
		return serviceInstanceGuid;
	}

	public void setServiceInstanceGuid(UUID serviceInstanceGuid) {
		this.serviceInstanceGuid = serviceInstanceGuid;
	}

	public Map<String, String> getCredentials() {
		return credentials;
	}

	public void setCredentials(Map<String, String> credentials) {
		this.credentials = credentials;
	}

	public Map<String, String> getBindingOptions() {
		return bindingOptions;
	}

	public void setBindingOptions(Map<String, String> bindingOptions) {
		this.bindingOptions = bindingOptions;
	}

	public String getGatewayData() {
		return gatewayData;
	}

	public void setGatewayData(String gatewayData) {
		this.gatewayData = gatewayData;
	}

	public String getGatewayName() {
		return gatewayName;
	}

	public void setGatewayName(String gatewayName) {
		this.gatewayName = gatewayName;
	}

	public String getSyslogDrainUrl() {
		return syslogDrainUrl;
	}

	public void setSyslogDrainUrl(String syslogDrainUrl) {
		this.syslogDrainUrl = syslogDrainUrl;
	}

	public String getAppUrl() {
		return appUrl;
	}

	public void setAppUrl(String appUrl) {
		this.appUrl = appUrl;
	}

	public String getServiceInstanceUrl() {
		return serviceInstanceUrl;
	}

	public void setServiceInstanceUrl(String serviceInstanceUrl) {
		this.serviceInstanceUrl = serviceInstanceUrl;
	}
	
}
