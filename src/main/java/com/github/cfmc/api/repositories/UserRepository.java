/**
 * 
 */
package com.github.cfmc.api.repositories;

import static org.mvel2.MVEL.evalToString;

import java.util.List;
import java.util.Map;

import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;

import com.github.cfmc.api.model.AccessToken;
import com.github.cfmc.api.model.SpaceUser;
import com.github.cfmc.api.model.UserInfo;
import com.github.cfmc.api.model.UserSession;
import com.github.cfmc.api.model.base.CloudFoundryResource;
import com.github.cfmc.api.model.base.CloudFoundryResources;

/**
 * 
 * @author Johannes Hiemer.
 *
 */
@Repository
@SuppressWarnings({"unchecked", "rawtypes"})
public class UserRepository extends RestRepository {

    private final String clientId;

    private final String clientSecret;

    @Autowired
    protected UserRepository(String clientId, String clientSecret) {
        super();
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    public List<CloudFoundryResource<SpaceUser>> getAllUsers(String token) {
        final String accessToken = getAccessToken(clientId, clientSecret);
        CloudFoundryResources<SpaceUser> users = list(accessToken, "v2/users", 1);
        
        return users.getResources();
    }
    
    public UserInfo getUserInfo(String token) {
    	UserSession userSession = customOneUaa(token, "userinfo", new ParameterizedTypeReference<UserSession>() {});

        UserInfo userInfo = customOneUaa(token, "Users/".concat(userSession.getId()), new ParameterizedTypeReference<UserInfo>() {});
        //CloudFoundryResource<SpaceUser> user = one(token, "v2/users", userSession.getId(), 1);
        return userInfo;
    }

    public AccessToken login(String username, String password) {
        String authorizationEndpoint = getAuthorizationEndpoint();

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        httpHeaders.add("Accept", "application/json;charset=utf-8");
        httpHeaders.add("Authorization", "Basic Y2Y6");

        String model = "grant_type=password&username=" + username + "&password=" + password;
        String endpoint = authorizationEndpoint.concat("/oauth/token");
        ResponseEntity<Map<String, Object>> loginResponse = restTemplate.exchange(endpoint, HttpMethod.POST, 
        		new HttpEntity(model, httpHeaders), new ParameterizedTypeReference<Map<String, Object>>() {});
        
        if (loginResponse.getStatusCode().equals(HttpStatus.OK)) {
            AccessToken accessToken = AccessToken.fromCloudFoundryModel(loginResponse.getBody());

            UserSession userInfo = customOneUaa(accessToken.getTokenType() + " " + accessToken.getAccessToken(), "userinfo", 
            		new ParameterizedTypeReference<UserSession>() {});
            accessToken.setId(userInfo.getId());
            accessToken.setUsername(userInfo.getUserName());
            return accessToken;
        }
        throw new RepositoryException("Unable to login", loginResponse);
    }

    private String getAuthorizationEndpoint() {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Accept", "application/json;charset=utf-8");

		ResponseEntity<Map<String, Object>> infoResponse = restTemplate.exchange(apiBaseUri.concat("info"), HttpMethod.GET, 
				new HttpEntity(httpHeaders), new ParameterizedTypeReference<Map<String, Object>>() {});
        if (!infoResponse.getStatusCode().equals(HttpStatus.OK)) {
            throw new RepositoryException("Unable to retrieve info", infoResponse);
        }
        return (String) infoResponse.getBody().get("authorization_endpoint");
    }

    public Map<String, Object> registerUser(String token, String username, String firstName, String lastName, String password) {    	
        String accessToken = getAccessToken(clientId, clientSecret);
        String userId = uaaCreateUser(accessToken, username, firstName, lastName, password);
        // TODO: 
        //return apiCreateUser(token, userId).getBody();
        return apiCreateUser(accessToken, userId).getBody();
    }

    private String getAccessToken(String clientId, String clientSecret) {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        httpHeaders.add("Accept", "application/json;charset=utf-8");
        httpHeaders.add("Authorization", getAuthorization(clientId, clientSecret));

        MultiValueMap<String, String> model = new LinkedMultiValueMap();
        model.add("grant_type", "client_credentials");
        model.add("response_type", "token");
        model.add("client_id", "admin");


        try {            
			ResponseEntity<Map<String, Object>> tokenResponse = restTemplate.exchange(uaaBaseUri.concat("oauth/token"), HttpMethod.POST, 
					new HttpEntity(model, httpHeaders), new ParameterizedTypeReference<Map<String, Object>>() {});
            if (!tokenResponse.getStatusCode().equals(HttpStatus.OK)) {
                throw new RepositoryException("Problem retrieving access token", tokenResponse);
            }

            String tokenType = evalToString("token_type", tokenResponse.getBody());
            String accessToken = evalToString("access_token", tokenResponse.getBody());
            return tokenType.concat(" ").concat(accessToken);
        } catch (HttpClientErrorException e) {
            throw new RepositoryException("Problem retrieving access token", new ResponseEntity(e.getResponseBodyAsString(), e.getStatusCode()));
        }
    }

    private String uaaCreateUser(String accessToken, String username, String firstName, String lastName, String password) {
    	String userId = null;
    	
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Content-Type", "application/json;charset=utf-8");
        httpHeaders.add("Accept", "application/json;charset=utf-8");
        httpHeaders.add("Authorization", accessToken);

        String body = new StringBuilder()
                .append("{\"userName\":\"")
                .append(username)
                .append("\",\"emails\":[{\"value\":\"")
                .append(username)
                .append("\"}],\"password\":\"")
                .append(password)
                .append("\",\"name\":{\"givenName\":\"")
                .append(firstName)
                .append("\",\"familyName\":\"")
                .append(lastName)
                .append("\"}}\"").toString();

        try {
            ResponseEntity<Map<String, Object>> createUserResponse = restTemplate.exchange(uaaBaseUri.concat("Users"), HttpMethod.POST, 
            		new HttpEntity(body, httpHeaders), new ParameterizedTypeReference<Map<String, Object>>() {});
            if (!createUserResponse.getStatusCode().equals(HttpStatus.CREATED)) {
                throw new RepositoryException("Unable to create user in uaa", createUserResponse);
            }
            userId = evalToString("id", createUserResponse.getBody());
            return userId;
        } catch (HttpClientErrorException e) {
            throw new RepositoryException("Unable to create user in uaa", new ResponseEntity(e.getResponseBodyAsString(), e.getStatusCode()));
        }
    }

    private ResponseEntity<Map<String, Object>> apiCreateUser(String accessToken, String userId) {
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Content-Type", "application/json;charset=utf-8");
        httpHeaders.add("Accept", "application/json;charset=utf-8");
        httpHeaders.add("Authorization", accessToken);

        String body = "{\"guid\":\"".concat(userId).concat("\"}");

        try {
            ResponseEntity<Map<String, Object>> createUserResponse = restTemplate.exchange(apiBaseUri.concat("v2/users"), HttpMethod.POST, 
            		new HttpEntity(body, httpHeaders), new ParameterizedTypeReference<Map<String, Object>>() {});
            if (!createUserResponse.getStatusCode().equals(HttpStatus.CREATED)) {
                throw new RepositoryException("Unable to create user using api", createUserResponse);
            }
            return createUserResponse;
            
        } catch (HttpClientErrorException e) {
            throw new RepositoryException("Unable to create user using api", new ResponseEntity(e.getResponseBodyAsString(), e.getStatusCode()));
        }
    }

    private String getAuthorization(String clientId, String clientSecret) {
        return "Basic ".concat(Base64.encodeBase64String(clientId.concat(":").concat(clientSecret).getBytes()));
    }
    
}
