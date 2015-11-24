/**
 * 
 */
package de.evoila.cfmc.api.repositories;

import static org.mvel2.MVEL.evalToString;

import java.util.List;
import java.util.Map;

import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Value;
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

import de.evoila.cfmc.api.model.AccessToken;
import de.evoila.cfmc.api.model.SpaceUser;
import de.evoila.cfmc.api.model.UserInfo;
import de.evoila.cfmc.api.model.UserSession;
import de.evoila.cfmc.api.model.base.CloudFoundryResource;
import de.evoila.cfmc.api.model.base.CloudFoundryResources;


/**
 * 
 * @author Johannes Hiemer.
 *
 */
@Repository
@SuppressWarnings({"unchecked", "rawtypes"})
public class UserRepository extends RestRepository {

	@Value("${cf.client}")
    private String client;

	@Value("${cf.secret}")
    private String secret;

    protected UserRepository() {
        super();
    }

    public List<CloudFoundryResource<SpaceUser>> getAllUsers(String token) {
        final String accessToken = getAccessToken(client, secret);
        CloudFoundryResources<SpaceUser> users = list(accessToken, "v2/users", 1, true);
        
        return users.getResources();
    }
    
    public UserInfo getUserInfo(String token) {
    	UserSession userSession = customOneUaa(token, "userinfo", new ParameterizedTypeReference<UserSession>() {});

        UserInfo userInfo = customOneUaa(token, "Users/".concat(userSession.getId()), new ParameterizedTypeReference<UserInfo>() {});
        //CloudFoundryResource<SpaceUser> user = one(token, "v2/users", userSession.getId(), 1);
        return userInfo;
    }
    
    // needed to prevent 403 error for operations usually limited to admin
    public String login() {
    	return "bearer " + this.login(client, secret).getAccessToken();
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

		ResponseEntity<Map<String, Object>> infoResponse = restTemplate.exchange(apiUri.concat("info"), HttpMethod.GET, 
				new HttpEntity(httpHeaders), new ParameterizedTypeReference<Map<String, Object>>() {});
        if (!infoResponse.getStatusCode().equals(HttpStatus.OK)) {
            throw new RepositoryException("Unable to retrieve info", infoResponse);
        }
        return (String) infoResponse.getBody().get("authorization_endpoint");
    }

    public Map<String, Object> registerUser(String token, String username, String firstName, String lastName, String password) {    	
        String accessToken = getAccessToken(client, secret);
        String userId = uaaCreateUser(accessToken, username, firstName, lastName, password);
        return apiCreateUser(token, userId).getBody();
    }
    
    public void deleteUser(String userId) {
    	String accessToken = getAccessToken(client, secret);
    	uaaDeleteUser(accessToken, userId);
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
			ResponseEntity<Map<String, Object>> tokenResponse = restTemplate.exchange(uaaUri.concat("oauth/token"), HttpMethod.POST, 
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

    
    private String uaaDeleteUser(String accessToken, String userId) {
    	String idDeleted = null;
    	
    	HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Content-Type", "application/json;charset=utf-8");
        httpHeaders.add("Accept", "application/json;charset=utf-8");
        httpHeaders.add("Authorization", accessToken);
        
        try {
            ResponseEntity<Map<String, Object>> createUserResponse = restTemplate.exchange(uaaUri.concat("Users/").concat(userId), HttpMethod.DELETE, 
            		new HttpEntity(null, httpHeaders), new ParameterizedTypeReference<Map<String, Object>>() {});
            if (!createUserResponse.getStatusCode().equals(HttpStatus.OK)) {
                throw new RepositoryException("Unable to delete user in uaa", createUserResponse);
            }
            idDeleted = evalToString("id", createUserResponse.getBody());
            return idDeleted;
        } 
        catch (HttpClientErrorException e) {
            throw new RepositoryException("Unable to delete user in uaa", new ResponseEntity(e.getResponseBodyAsString(), e.getStatusCode()));
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
            ResponseEntity<Map<String, Object>> createUserResponse = restTemplate.exchange(uaaUri.concat("Users"), HttpMethod.POST, 
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
            ResponseEntity<Map<String, Object>> createUserResponse = restTemplate.exchange(apiUri.concat("v2/users"), HttpMethod.POST, 
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
