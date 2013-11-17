/**
 * 
 */
package com.github.cfc.api.repositories;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.cfc.api.model.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.mvel2.MVEL.eval;

/**
 * TODO: Add previous authors
 * @author Johannes Hiemer
 *
 */
@Repository
public class ServiceRepository extends BaseRepository {

    @Autowired
    protected ServiceRepository(RestTemplate restTemplate, AsyncTaskExecutor asyncTaskExecutor, ObjectMapper objectMapper, String apiBaseUri, String uaaBaseUri) {
        super(restTemplate, asyncTaskExecutor, objectMapper, apiBaseUri, uaaBaseUri);
    }

    public List<Service> getAll(String token) {
        Map<String, Object> servicesResponse = apiGet(token, "v2/services?inline-relations-depth=1");

        List<Service> services = new ArrayList<Service>();
        for (Object serviceResource : eval("resources", servicesResponse, List.class)) {
            services.add(Service.fromCloudFoundryModel(serviceResource));
        }
        return services;
    }

}
