/**
 * 
 */
package de.evoila.cfmc.api.model;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonProperty;

import de.evoila.cfmc.api.model.base.CloudFoundryResource;


/**
 * 
 * @author Johannes Hiemer.
 *
 */

public class Application {

	@JsonProperty("name")
	private String name;
	
	@JsonProperty("production")
	private boolean production;
	
	@JsonProperty("environment_json")
	private HashMap<Object, Object> environmentJson;
	
	@JsonProperty("memory")
	private int memory;
	
	@JsonProperty("instances")
	private int instances;
	
	@JsonProperty("file_descriptors")
	private int fileDescriptors;
	
	@JsonProperty("disk_quota")
	private int diskQuota;
	
	@JsonProperty("state")
	private String state;
	
	@JsonProperty("command")
	private String command;
	
	@JsonProperty("console")
	private boolean console;
	
	@JsonProperty("space_guid")
	private UUID spaceGuid;
	
	@JsonProperty("runtime_guid")
	private UUID runtimeGuid;
	
	@JsonProperty("runtime_url")
	private String runtimeUrl;
	
	@JsonProperty("framework_guid")
	private UUID frameworkGuid;
	
	@JsonProperty("framework_url")
	private String frameworkUrl;
	
	@JsonProperty("stack_guid")
	private String stackGuid;
	
	@JsonProperty("buildpack")
	private String buildpack;
	
	@JsonProperty("detected_buildpack")
	private String detectedBuildpack;
	
	@JsonProperty("version")
	private String version;
	
	@JsonProperty("debug")
	private String debug;
	
	@JsonProperty("staging_task_id")
	private String stagingTaskId;
	
	@JsonProperty("package_state")
	private String packageState;
	
	@JsonProperty("health_check_type")
	private String healthCheckType;

	@JsonProperty("health_check_timeout")
	private int healthCheckTimeout;
	
	@JsonProperty("staging_failed_reason")
	private String StagingFailedReason;
    
	@JsonProperty("staging_failed_description")
	private String stagingFailedDescription;
    
	@JsonProperty("diego")
	private boolean diego;
    
	@JsonProperty("docker_image")
	private String dockerImage;
    
	@JsonProperty("package_updated_at")
	private String packageUpdatedAt;
    
	@JsonProperty("detected_start_command")
	private String detectedStartCommand;

	@JsonProperty("enable_ssh")
	private boolean enableSsh;

	@JsonProperty("docker_credentials_json")
	private HashMap<Object, Object> dockerCredentialsJson;
    
	@JsonProperty("space_url")
	private String spaceUrl;
    
	@JsonProperty("space")
	private CloudFoundryResource<Space> space;
    
	@JsonProperty("stack_url")
	private String stackUrl;
    
	@JsonProperty("stack")
	private HashMap<Object, Object> stack;
    
	@JsonProperty("events_url")
	private String eventsUrl;
    
	@JsonProperty("service_bindings_url")
	private String serviceBindingsUrl;
    
	@JsonProperty("service_bindings")
	private List<String> serviceBindings;
    
	@JsonProperty("routes_url")
	private String routesUrl;
    
	@JsonProperty("routes")
	private List<CloudFoundryResource<Route>> routes;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public boolean isProduction() {
		return production;
	}

	public void setProduction(boolean production) {
		this.production = production;
	}

	public HashMap<Object, Object> getEnvironmentJson() {
		return environmentJson;
	}

	public void setEnvironmentJson(HashMap<Object, Object> environmentJson) {
		this.environmentJson = environmentJson;
	}

	public int getMemory() {
		return memory;
	}

	public void setMemory(int memory) {
		this.memory = memory;
	}

	public int getInstances() {
		return instances;
	}

	public void setInstances(int instances) {
		this.instances = instances;
	}

	public int getFileDescriptors() {
		return fileDescriptors;
	}

	public void setFileDescriptors(int fileDescriptors) {
		this.fileDescriptors = fileDescriptors;
	}

	public int getDiskQuota() {
		return diskQuota;
	}

	public void setDiskQuota(int diskQuota) {
		this.diskQuota = diskQuota;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getCommand() {
		return command;
	}

	public void setCommand(String command) {
		this.command = command;
	}

	public boolean isConsole() {
		return console;
	}

	public void setConsole(boolean console) {
		this.console = console;
	}

	public UUID getSpaceGuid() {
		return spaceGuid;
	}

	public void setSpaceGuid(UUID spaceGuid) {
		this.spaceGuid = spaceGuid;
	}

	public UUID getRuntimeGuid() {
		return runtimeGuid;
	}

	public void setRuntimeGuid(UUID runtimeGuid) {
		this.runtimeGuid = runtimeGuid;
	}

	public String getRuntimeUrl() {
		return runtimeUrl;
	}

	public void setRuntimeUrl(String runtimeUrl) {
		this.runtimeUrl = runtimeUrl;
	}

	public UUID getFrameworkGuid() {
		return frameworkGuid;
	}

	public void setFrameworkGuid(UUID frameworkGuid) {
		this.frameworkGuid = frameworkGuid;
	}

	public String getFrameworkUrl() {
		return frameworkUrl;
	}

	public void setFrameworkUrl(String frameworkUrl) {
		this.frameworkUrl = frameworkUrl;
	}

	public String getStackGuid() {
		return stackGuid;
	}

	public void setStackGuid(String stackGuid) {
		this.stackGuid = stackGuid;
	}

	public String getBuildpack() {
		return buildpack;
	}

	public void setBuildpack(String buildpack) {
		this.buildpack = buildpack;
	}

	public String getDetectedBuildpack() {
		return detectedBuildpack;
	}

	public void setDetectedBuildpack(String detectedBuildpack) {
		this.detectedBuildpack = detectedBuildpack;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getDebug() {
		return debug;
	}

	public void setDebug(String debug) {
		this.debug = debug;
	}

	public String getStagingTaskId() {
		return stagingTaskId;
	}

	public void setStagingTaskId(String stagingTaskId) {
		this.stagingTaskId = stagingTaskId;
	}

	public String getPackageState() {
		return packageState;
	}

	public void setPackageState(String packageState) {
		this.packageState = packageState;
	}

	public String getHealthCheckType() {
		return healthCheckType;
	}

	public void setHealthCheckType(String healthCheckType) {
		this.healthCheckType = healthCheckType;
	}

	public int getHealthCheckTimeout() {
		return healthCheckTimeout;
	}

	public void setHealthCheckTimeout(int healthCheckTimeout) {
		this.healthCheckTimeout = healthCheckTimeout;
	}

	public String getStagingFailedReason() {
		return StagingFailedReason;
	}

	public void setStagingFailedReason(String stagingFailedReason) {
		StagingFailedReason = stagingFailedReason;
	}

	public String getStagingFailedDescription() {
		return stagingFailedDescription;
	}

	public void setStagingFailedDescription(String stagingFailedDescription) {
		this.stagingFailedDescription = stagingFailedDescription;
	}

	public boolean isDiego() {
		return diego;
	}

	public void setDiego(boolean diego) {
		this.diego = diego;
	}

	public String getDockerImage() {
		return dockerImage;
	}

	public void setDockerImage(String dockerImage) {
		this.dockerImage = dockerImage;
	}

	public String getPackageUpdatedAt() {
		return packageUpdatedAt;
	}

	public void setPackageUpdatedAt(String packageUpdatedAt) {
		this.packageUpdatedAt = packageUpdatedAt;
	}

	public String getDetectedStartCommand() {
		return detectedStartCommand;
	}

	public void setDetectedStartCommand(String detectedStartCommand) {
		this.detectedStartCommand = detectedStartCommand;
	}

	public boolean isEnableSsh() {
		return enableSsh;
	}

	public void setEnableSsh(boolean enableSsh) {
		this.enableSsh = enableSsh;
	}

	public HashMap<Object, Object> getDockerCredentialsJson() {
		return dockerCredentialsJson;
	}

	public void setDockerCredentialsJson(HashMap<Object, Object> dockerCredentialsJson) {
		this.dockerCredentialsJson = dockerCredentialsJson;
	}

	public String getSpaceUrl() {
		return spaceUrl;
	}

	public void setSpaceUrl(String spaceUrl) {
		this.spaceUrl = spaceUrl;
	}

	public CloudFoundryResource<Space> getSpace() {
		return space;
	}

	public void setSpace(CloudFoundryResource<Space> space) {
		this.space = space;
	}

	public String getStackUrl() {
		return stackUrl;
	}

	public void setStackUrl(String stackUrl) {
		this.stackUrl = stackUrl;
	}

	public HashMap<Object, Object> getStack() {
		return stack;
	}

	public void setStack(HashMap<Object, Object> stack) {
		this.stack = stack;
	}

	public String getEventsUrl() {
		return eventsUrl;
	}

	public void setEventsUrl(String eventsUrl) {
		this.eventsUrl = eventsUrl;
	}

	public String getServiceBindingsUrl() {
		return serviceBindingsUrl;
	}

	public void setServiceBindingsUrl(String serviceBindingsUrl) {
		this.serviceBindingsUrl = serviceBindingsUrl;
	}

	public List<String> getServiceBindings() {
		return serviceBindings;
	}

	public void setServiceBindings(List<String> serviceBindings) {
		this.serviceBindings = serviceBindings;
	}

	public String getRoutesUrl() {
		return routesUrl;
	}

	public void setRoutesUrl(String routesUrl) {
		this.routesUrl = routesUrl;
	}

	public List<CloudFoundryResource<Route>> getRoutes() {
		return routes;
	}

	public void setRoutes(List<CloudFoundryResource<Route>> routes) {
		this.routes = routes;
	}
	
}
