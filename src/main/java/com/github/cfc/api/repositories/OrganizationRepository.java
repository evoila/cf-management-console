/**
 * 
 */
package com.github.cfc.api.repositories;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.cfc.api.model.Organization;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static java.lang.String.valueOf;
import static org.mvel2.MVEL.eval;
import static org.mvel2.MVEL.evalToString;

/**
 * 
 * @author johanneshiemer
 *
 */
@Repository
public class OrganizationRepository extends BaseRepository {

    private static final String V2_ORGANIZATIONS = "v2/organizations/";
    
	private final SpaceRepository spaceRepository;

    @Autowired
    protected OrganizationRepository(final RestTemplate restTemplate, final AsyncTaskExecutor asyncTaskExecutor, 
    		@Qualifier("apiBaseUri") final String apiBaseUri, @Qualifier("uaaBaseUri") final String uaaBaseUri, 
    		final ObjectMapper mapper, SpaceRepository spaceRepository) {
    	
        super(restTemplate, asyncTaskExecutor, mapper, apiBaseUri, uaaBaseUri);
        this.spaceRepository = spaceRepository;
    }

    public void deleteById(String token, String id) {
    	
        Map<String, Object> organizationResponse = apiGet(token, V2_ORGANIZATIONS.concat(id).concat("?inline-relations-depth=1"));
        for (Object app : eval("entity.spaces", organizationResponse, List.class)) {
            spaceRepository.deleteById(token, evalToString("metadata.guid", app));
        }
        apiDelete(token, V2_ORGANIZATIONS.concat(id));
    }

    public Organization getById(final String token, final String id, final int depth) {
    	
        Map<String, Object> organizationResponse = apiGet(token, V2_ORGANIZATIONS.concat(id).concat("?inline-relations-depth=").concat(valueOf(depth)));
        Organization organization = Organization.fromCloudFoundryModel(organizationResponse);
        return appendUsername(token, organization);
    }

    public List<Organization> getAll(String token, int depth) {
    	
        Map<String, Object> organizationResponse = apiGet(token, "v2/organizations?inline-relations-depth=".concat(valueOf(depth)));

        List<Organization> organizations = new ArrayList<Organization>();
        for (Object organizationResource : eval("resources", organizationResponse, List.class)) {
            Organization organization = Organization.fromCloudFoundryModel(organizationResource);
            organizations.add(appendUsername(token, organization));
        }
        return organizations;
    }

    public String updateOrganization(String token, String id, String body) {
    	
        return apiPut(token, V2_ORGANIZATIONS.concat(id).concat("?collection-method=add"), body);
    }

    public String createOrganization(String token, String body) {
    	
        return apiPost(token, "v2/organizations", body);
    }
}
