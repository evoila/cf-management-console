/**
 * 
 */
package com.github.config.web;

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
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
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
@Configuration
@EnableWebMvc
@ComponentScan(basePackages = {"com.github.cfmc"})
@PropertySource("classpath:application.properties")
public class CustomMvcConfiguration extends WebMvcConfigurerAdapter {

    @Autowired
    private Environment env;
    
    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
		configurer.enable();
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
        resolver.setPrefix("/WEB-INF/");
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

}
