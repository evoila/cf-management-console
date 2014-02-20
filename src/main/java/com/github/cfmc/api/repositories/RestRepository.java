/**
 * 
 */
package com.github.cfmc.api.repositories;

import static org.mvel2.MVEL.eval;
import static org.mvel2.MVEL.evalToString;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
 * @author johanneshiemer
 *
 */
@Service
public class RestRepository {

    private static final Logger LOGGER = LoggerFactory.getLogger(RestRepository.class);

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

    public Map<String, Object> uaaGet(String token, String path) {
        ResponseEntity<Map<String, Object>> responseEntity = exchange(token, uaaBaseUri, HttpMethod.GET, path, null, new ParameterizedTypeReference<Map<String, Object>>() {});
        if (!responseEntity.getStatusCode().equals(HttpStatus.OK)) {
            throw new RepositoryException("Cannot perform uaa get for path [" + path + "]", responseEntity);
        }
        return responseEntity.getBody();
    }

    /**
     * 
     * @param token
     * @param path
     * @return
     */
    public <T> CloudFoundryResources<T> apiGetv2(String token, String path) {
    	ResponseEntity<CloudFoundryResources<T>> responseEntity = exchange(token, apiBaseUri, HttpMethod.GET, path.concat("?inline-relations-depth=2"), null, 
    			new ParameterizedTypeReference<CloudFoundryResources<T>>() {});
    	if (!responseEntity.getStatusCode().equals(HttpStatus.OK)) {
    		 throw new RepositoryException("Cannot perform uaa get for path [" + path + "]", responseEntity);
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
    public <T> CloudFoundryResource<T> one(String token, String path, String id) {
    	ResponseEntity<CloudFoundryResource<T>> responseEntity = exchange(token, apiBaseUri, HttpMethod.GET, path.concat("/").concat(id).concat("?inline-relations-depth=2"), null, 
    			new ParameterizedTypeReference<CloudFoundryResource<T>>() {});
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
            throw new RepositoryException("Cannot perform api put for path [" + path + "]", responseEntity);
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
            throw new RepositoryException("Cannot perform api put for path [" + path + "]", responseEntity);
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
        ResponseEntity<String> responseEntity = exchange(token, apiBaseUri, HttpMethod.DELETE, path.concat("/").concat(id), null, new ParameterizedTypeReference<String>() {});
        if (!responseEntity.getStatusCode().equals(HttpStatus.NO_CONTENT)) {
            throw new RepositoryException("Cannot perform api delete for path [" + path + "]", responseEntity);
        }
        return responseEntity.getBody();
    }

    @SuppressWarnings({ "rawtypes", "unchecked" })
    private <T> ResponseEntity<T> exchange(String token, String baseUri, HttpMethod method, String path, String body, ParameterizedTypeReference<T> typeReference) {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Accept", "application/json");
        httpHeaders.add("Authorization", token);

        
		HttpEntity request;
        if (body == null) {
            request = new HttpEntity(httpHeaders);
        } else {
            request = new HttpEntity(body, httpHeaders);
        }

        try {
            return restTemplate.exchange(baseUri.concat(path), method, request, typeReference);
        } catch (HttpClientErrorException e) {
            throw new RepositoryException("Unable to perform exchange for path [" + path + "]", new ResponseEntity(e.getResponseBodyAsString(), e.getStatusCode()));
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
            throw new RepositoryException("Unable to perform exchange for path [" + path + "]", new ResponseEntity(e.getResponseBodyAsString(), e.getStatusCode()));
        }
    }

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

}
