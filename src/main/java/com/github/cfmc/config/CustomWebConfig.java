/**
 * 
 */
package com.github.cfmc.config;

import java.util.List;

import org.apache.http.client.config.RequestConfig;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.core.task.AsyncTaskExecutor;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.scheduling.concurrent.ConcurrentTaskExecutor;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * 
 * @author Johannes Hiemer.
 *
 */
@ComponentScan("com.github.cfmc")
@Configuration
@EnableWebMvc
@PropertySource("classpath:application.properties")
public class CustomWebConfig extends WebMvcConfigurerAdapter {

    @Autowired
    private Environment env;

    @Bean
    public RestTemplate getRestTemplate() {
    	RequestConfig requestConfig = RequestConfig.custom()
    			.setConnectTimeout(5 * 1000)
    			.setSocketTimeout(5 * 1000)
    			.setStaleConnectionCheckEnabled(false)
    			.build();
    	
    	
        Registry<ConnectionSocketFactory> registry = RegistryBuilder.<ConnectionSocketFactory>create()
        		.register("http", PlainConnectionSocketFactory.getSocketFactory())
        		.register("https", SSLConnectionSocketFactory.getSocketFactory())
        		.build();
    	
        PoolingHttpClientConnectionManager poolingHttpClientConnectionManager = new PoolingHttpClientConnectionManager(registry);
        poolingHttpClientConnectionManager.setMaxTotal(100);
        
        final RestTemplate restTemplate = new RestTemplate();
        CloseableHttpClient httpClientBuilder = HttpClientBuilder.create()
        		.setConnectionManager(poolingHttpClientConnectionManager)
        		.setDefaultRequestConfig(requestConfig)
        		.build();
        
        restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory(httpClientBuilder));
        return new RestTemplate();
    }

    @Bean
    public ViewResolver getViewResolver() {
        final InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/");
        resolver.setSuffix(".html");
        return resolver;
    }

    @Bean
    public ObjectMapper getObjectMapper() {
        final ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);
        return objectMapper;
    }

    @Bean(name = "uaaBaseUri")
    public String getUaaBaseUri() {
        return env.getProperty("base.uaa.url");
    }

    @Bean(name = "apiBaseUri")
    public String getApiBaseUri() {
        return env.getProperty("base.api.url");
    }

    @Bean(name = "clientId")
    public String getClientId() {
        return env.getProperty("clientId");
    }
    
    @Bean(name = "clientSecret")
    public String getClientSecret() {
        return env.getProperty("clientSecret");
    }

    @Bean
    public AsyncTaskExecutor getAsyncTaskExecutor(){
        return new ConcurrentTaskExecutor();
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/css/**").addResourceLocations("/WEB-INF/css/");
        registry.addResourceHandler("/fonts/**").addResourceLocations("/WEB-INF/fonts/");
        registry.addResourceHandler("/img/**").addResourceLocations("/WEB-INF/img/");
        registry.addResourceHandler("/lib/**").addResourceLocations("/WEB-INF/lib/");
        registry.addResourceHandler("/js/**").addResourceLocations("/WEB-INF/js/");
        registry.addResourceHandler("/partials/**").addResourceLocations("/WEB-INF/partials/");
        registry.addResourceHandler("/index.html").addResourceLocations("/WEB-INF/index.html");
    }

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        final MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setObjectMapper(getObjectMapper());
    }
}
