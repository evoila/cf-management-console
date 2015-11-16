/**
 * 
 */
package com.github.cfmc.api.repositories;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.github.cfmc.api.model.base.CloudFoundryResource;
import com.github.cfmc.api.model.base.CloudFoundryResources;

/**
 * 
 * @author Johannes Hiemer
 *
 */
@Service
public class RestRepository {

    @Autowired
    protected RestTemplate restTemplate;

    @Autowired
    protected String apiBaseUri;
    
    @Autowired
    protected String uaaBaseUri;
    
    public RestRepository() {
    }

    protected String concatSlashIfNeeded(String uri) {
        if (!uri.endsWith("/")) {
            return uri.concat("/");
        }
        return uri;
    }

    /**
     * 
     * @param token
     * @param path
     * @return
     */
    public <T> CloudFoundryResources<T> list(String token, String path, int depth, boolean useDepth) {
    	ResponseEntity<CloudFoundryResources<T>> responseEntity;
    	if(useDepth)
    		responseEntity = exchange(token, apiBaseUri, 
    			HttpMethod.GET, path.concat("?inline-relations-depth=" + depth), null, 
    			new ParameterizedTypeReference<CloudFoundryResources<T>>() {});
    	else
    		responseEntity = exchange(token, apiBaseUri, 
        			HttpMethod.GET, path, null, 
        			new ParameterizedTypeReference<CloudFoundryResources<T>>() {});
    	
    	if (!responseEntity.getStatusCode().equals(HttpStatus.OK)) {
    		 throw new RepositoryException("Cannot perform uaa get for path [" + path + "]", responseEntity, responseEntity.getStatusCode());
    	}
    	return responseEntity.getBody();
    }
    
    /**
     * 
     * @param token
     * @param path
     * @return
     */
    public <T> Map<String, T> customList(String token, String path, int depth) {
    	ResponseEntity<Map<String, T>> responseEntity = exchange(token, apiBaseUri, HttpMethod.GET, 
    			path.concat("?inline-relations-depth=" + depth), null, 
    			new ParameterizedTypeReference<Map<String, T>>() {});
    	if (!responseEntity.getStatusCode().equals(HttpStatus.OK)) {
    		 throw new RepositoryException("Cannot perform uaa get for path [" + path + "]", responseEntity, responseEntity.getStatusCode());
    	}
    	return responseEntity.getBody();
    }
    
    /**
     * 
     * @param token
     * @param path
     * @param id
     * @return
     */
    public <T> CloudFoundryResource<T> one(String token, String path, String id, int depth) {
    	ResponseEntity<CloudFoundryResource<T>> responseEntity = exchange(token, apiBaseUri, HttpMethod.GET, 
    			path.concat("/").concat(id).concat("?inline-relations-depth=" + depth), null, 
    			new ParameterizedTypeReference<CloudFoundryResource<T>>() {});
    	if (!responseEntity.getStatusCode().equals(HttpStatus.OK)) {
    		 throw new RepositoryException("Cannot perform api get for path [" + path + "]", responseEntity, responseEntity.getStatusCode());
    	}
    	return responseEntity.getBody();
    }
    
    /**
     * 
     * @param token
     * @param path
     * @param parameterizedTypeReference
     * @return
     */
    public <T> T customOneUaa(String token, String path, ParameterizedTypeReference<T> parameterizedTypeReference) {
        ResponseEntity<T> responseEntity = exchange(token, uaaBaseUri, HttpMethod.GET, path, null, 
        		parameterizedTypeReference);
        if (!responseEntity.getStatusCode().equals(HttpStatus.OK)) {
            throw new RepositoryException("Cannot perform uaa get for path [" + path + "]", responseEntity);
        }
        return responseEntity.getBody();
    }
    
    /**
     * 
     * @param token
     * @param path
     * @param parameterizedTypeReference
     * @return
     */
    public <T> T customOne(String token, String path, ParameterizedTypeReference<T> parameterizedTypeReference) {
        ResponseEntity<T> responseEntity = exchange(token, apiBaseUri, HttpMethod.GET, path, null, 
        		parameterizedTypeReference);
        if (!responseEntity.getStatusCode().equals(HttpStatus.OK)) {
            throw new RepositoryException("Cannot perform uaa get for path [" + path + "]", responseEntity);
        }
        return responseEntity.getBody();
    }
    
   
    
    /**
     * 
     * @param token
     * @param path
     * @param resource
     * @return
     */
    public <T> CloudFoundryResource<T> save(String token, String path, CloudFoundryResource<T> resource) {
    	ResponseEntity<CloudFoundryResource<T>> responseEntity = exchangev2(token, apiBaseUri, HttpMethod.POST, path, resource.getEntity(), 
    			new ParameterizedTypeReference<CloudFoundryResource<T>>() {});
        if (!responseEntity.getStatusCode().equals(HttpStatus.CREATED)) {
            throw new RepositoryException("Cannot perform api put for path [" + path + "]", responseEntity, responseEntity.getStatusCode());
        }
        return responseEntity.getBody();
    }
    
    /**
     * 
     * @param token
     * @param path
     * @param body
     * @return
     */
    public <T> CloudFoundryResource<T> update(String token, String path, CloudFoundryResource<T> resource) {
        ResponseEntity<CloudFoundryResource<T>> responseEntity = exchangev2(token, apiBaseUri, HttpMethod.PUT, path, resource.getEntity(), 
        		new ParameterizedTypeReference<CloudFoundryResource<T>>() {});
        if (!responseEntity.getStatusCode().equals(HttpStatus.CREATED)) {
            throw new RepositoryException("Cannot perform api put for path [" + path + "]", responseEntity, responseEntity.getStatusCode());
        }
        return responseEntity.getBody();
    }


    /**
     * 
     * @param token
     * @param path
     * @return
     */
    public String delete(String token, String path, String id) {
        ResponseEntity<String> responseEntity = exchange(token, apiBaseUri, HttpMethod.DELETE, path.concat("/").concat(id), null, 
        		new ParameterizedTypeReference<String>() {});
        if (!responseEntity.getStatusCode().equals(HttpStatus.NO_CONTENT)) {
            throw new RepositoryException("Cannot perform api delete for path [" + path + "]", responseEntity, responseEntity.getStatusCode());
        }
        return responseEntity.getBody();
    }

    @SuppressWarnings({ "rawtypes", "unchecked" })
    private <T> ResponseEntity<T> exchange(String token, String baseUri, HttpMethod method, String path, 
    		T resource, ParameterizedTypeReference<T> parameterizedTypeReference) {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Accept", "application/json");
        httpHeaders.add("Authorization", token);

        
		HttpEntity request;
        if (resource == null) {
            request = new HttpEntity(httpHeaders);
        } else {
            request = new HttpEntity(resource, httpHeaders);
        }

        try {
        	System.out.println("URL: " + baseUri.concat(path));
            return restTemplate.exchange(baseUri.concat(path), method, request, parameterizedTypeReference);
        } catch (HttpClientErrorException e) {
            throw new RepositoryException("Unable to perform exchange for path [" + path + "]", 
            		new ResponseEntity(e.getResponseBodyAsString(), e.getStatusCode()), e.getStatusCode());
        }
    }
    
    @SuppressWarnings({ "rawtypes", "unchecked" })
    private <T> ResponseEntity<CloudFoundryResource<T>> exchangev2(String token, String baseUri, HttpMethod method, String path, T resource,
    		ParameterizedTypeReference<CloudFoundryResource<T>> parameterizedTypeReference) {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Accept", "application/json");
        httpHeaders.add("Authorization", token);

        
		HttpEntity request;
        if (resource == null) {
            request = new HttpEntity(httpHeaders);
        } else {
            request = new HttpEntity(resource, httpHeaders);
        }

        try {
            return restTemplate.exchange(baseUri.concat(path), method, request, parameterizedTypeReference);
        } catch (HttpClientErrorException e) {
            throw new RepositoryException("Unable to perform exchange for path [" + path + "]", 
            		new ResponseEntity(e.getResponseBodyAsString(), e.getStatusCode()), e.getStatusCode());
        }
    }
    
    /**
    protected Map<String, String> getUserNames(String token, Set<String> userIds) {
        Map<String, String> userNames = new HashMap<String, String>();
        try {
            Map<String, Object> userDetailsResponse = uaaGet(token, getUserDetailsPath(userIds));
            for (Object resource : eval("resources", userDetailsResponse, List.class)) {
                userNames.put(evalToString("id", resource), evalToString("userName", resource));
            }
        } catch (RepositoryException re) {
            LOGGER.info("Problem retrieving user names from UAA");
        }
        return userNames;
    }
   

    private String getUserDetailsPath(Set<String> userIds) {
        String path = "Users?q=";

        int i = 0;
        for (String userId : userIds) {
            path = path.concat("id:").concat(userId);
            if (i < userIds.size() - 1) {
                path = path.concat(" or ");
            }
            i++;
        }
        return path;
    }
     **/

}
