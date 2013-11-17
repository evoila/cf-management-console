/**
 * 
 */
package com.github.cfc.api.repositories;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.cfc.api.model.Organization;
import com.github.cfc.api.model.OrganizationUser;
import com.github.cfc.api.model.Space;
import com.github.cfc.api.model.SpaceUser;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.http.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.Callable;
import java.util.concurrent.Future;

import static org.mvel2.MVEL.eval;
import static org.mvel2.MVEL.evalToString;

/**
 * TODO: Add previous authors
 * @author johanneshiemer
 *
 */
public abstract class BaseRepository {

    private static final Logger LOGGER = LoggerFactory.getLogger(BaseRepository.class);

    private final RestTemplate restTemplate;
    private final AsyncTaskExecutor asyncTaskExecutor;
    private final ObjectMapper objectMapper;
    private final String apiBaseUri;
    private final String uaaBaseUri;

    protected BaseRepository(RestTemplate restTemplate, AsyncTaskExecutor asyncTaskExecutor, ObjectMapper objectMapper, String apiBaseUri, String uaaBaseUri) {
        this.restTemplate = restTemplate;
        this.asyncTaskExecutor = asyncTaskExecutor;
        this.objectMapper = objectMapper;
        this.apiBaseUri = concatSlashIfNeeded(apiBaseUri);
        this.uaaBaseUri = concatSlashIfNeeded(uaaBaseUri);
    }

    protected String concatSlashIfNeeded(String uri) {
        if (!uri.endsWith("/")) {
            return uri.concat("/");
        }
        return uri;
    }

    protected ObjectMapper getMapper() {
        return objectMapper;
    }

    public RestTemplate getRestTemplate() {
        return restTemplate;
    }

    protected Organization appendUsername(String token, Organization organization) {
        Set<String> userIds = getUserIds(organization);
        if (!userIds.isEmpty()) {
            Map<String, String> userNames = getUserNames(token, userIds);
            for (Map.Entry<String, String> userName : userNames.entrySet()) {
                for (OrganizationUser orgUser : organization.getUsers()) {
                    if (orgUser.getId().equals(userName.getKey())) {
                        orgUser.setUsername(userName.getValue());
                    }
                }
                for (Space space : organization.getSpaces()) {
                    for (SpaceUser spaceUser : space.getUsers()) {
                        if (spaceUser.getId().equals(userName.getKey())) {
                            spaceUser.setUsername(userName.getValue());
                        }
                    }
                }
            }
        }
        return organization;
    }

    protected List<Space> appendUsername(String token, List<Space> spaces) {
        Set<String> userIds = getUserIds(spaces);
        if (!userIds.isEmpty()) {
            Map<String, String> userNames = getUserNames(token, userIds);
            for (Map.Entry<String, String> userName : userNames.entrySet()) {
                for (Space space : spaces) {
                    for (SpaceUser spaceUser : space.getUsers()) {
                        if (spaceUser.getId().equals(userName.getKey())) {
                            spaceUser.setUsername(userName.getValue());
                        }
                    }
                }
            }
        }
        return spaces;
    }

    protected Map<String, Object> uaaGet(String token, String path) {
        ResponseEntity<Map<String, Object>> responseEntity = exchange(token, uaaBaseUri, HttpMethod.GET, path, null, new ParameterizedTypeReference<Map<String, Object>>() {});
        if (!responseEntity.getStatusCode().equals(HttpStatus.OK)) {
            throw new RepositoryException("Cannot perform uaa get for path [" + path + "]", responseEntity);
        }
        return responseEntity.getBody();
    }

    protected Map<String, Object> apiGet(String token, String path) {
        ResponseEntity<Map<String, Object>> responseEntity = exchange(token, apiBaseUri, HttpMethod.GET, path, null, new ParameterizedTypeReference<Map<String, Object>>() {});
        if (!responseEntity.getStatusCode().equals(HttpStatus.OK)) {
            throw new RepositoryException("Cannot perform api get for path [" + path + "]", responseEntity);
        }
        return responseEntity.getBody();
    }

    protected String apiDelete(String token, String path) {
        ResponseEntity<String> responseEntity = exchange(token, apiBaseUri, HttpMethod.DELETE, path, null, new ParameterizedTypeReference<String>() {});
        if (!responseEntity.getStatusCode().equals(HttpStatus.NO_CONTENT)) {
            throw new RepositoryException("Cannot perform api delete for path [" + path + "]", responseEntity);
        }
        return responseEntity.getBody();
    }

    protected String apiPost(String token, String path, String body) {
        ResponseEntity<String> responseEntity = exchange(token, apiBaseUri, HttpMethod.POST, path, body, new ParameterizedTypeReference<String>() {});
        if (!responseEntity.getStatusCode().equals(HttpStatus.CREATED)) {
            throw new RepositoryException("Cannot perform api put for path [" + path + "]", responseEntity);
        }
        return responseEntity.getBody();
    }

    protected String apiPut(String token, String path, String body) {
        ResponseEntity<String> responseEntity = exchange(token, apiBaseUri, HttpMethod.PUT, path, body, new ParameterizedTypeReference<String>() {});
        if (!responseEntity.getStatusCode().equals(HttpStatus.CREATED)) {
            throw new RepositoryException("Cannot perform api put for path [" + path + "]", responseEntity);
        }
        return responseEntity.getBody();
    }

    protected Future<ResponseEntity<Map<String, Object>>> asyncApiGet(final String token, final String path) {
        return asyncTaskExecutor.submit(new Callable<ResponseEntity<Map<String, Object>>>() {
            @Override
            public ResponseEntity<Map<String, Object>> call() throws Exception {
                return exchange(token, apiBaseUri, HttpMethod.GET, path, null, new ParameterizedTypeReference<Map<String, Object>>() {});
            }
        });
    }

    @SuppressWarnings({ "rawtypes", "unchecked" })
    protected <T> ResponseEntity<T> exchange(String token, String baseUri, HttpMethod method, String path, String body, ParameterizedTypeReference<T> typeReference) {
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

    private Set<String> getUserIds(Organization organization) {
        final Set<String> userIds = new HashSet<String>();
        for (OrganizationUser orgUser : organization.getUsers()) {
            if (!userIds.contains(orgUser.getId())) {
                userIds.add(orgUser.getId());
            }
        }
        userIds.addAll(getUserIds(organization.getSpaces()));
        return userIds;
    }

    private Set<String> getUserIds(List<Space> spaces) {
        final Set<String> userIds = new HashSet<String>();
        for (Space space : spaces) {
            for (SpaceUser spaceUser : space.getUsers()) {
                if (!userIds.contains(spaceUser.getId())) {
                    userIds.add(spaceUser.getId());
                }
            }
        }
        return userIds;
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
