/**
 * 
 */
package de.evoila.cfmc;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.http.client.config.RequestConfig;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
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
public class CustomMvcConfiguration extends WebMvcConfigurerAdapter {

    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
		configurer.enable();
    }
    
    @Bean
    public RestTemplate getRestTemplate() {
    	enableSSL();
    	
    	RequestConfig requestConfig = RequestConfig.custom()
    			.setConnectTimeout(5 * 1000)
    			.setSocketTimeout(5 * 1000)
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
    
    private void enableSSL() {
        TrustManager[] trustAllCerts = new TrustManager[]{
            new X509TrustManager() {
                public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                    return null;
                }
 
                public void checkClientTrusted(
                        java.security.cert.X509Certificate[] certs, String authType) {
                }
 
                public void checkServerTrusted(
                        java.security.cert.X509Certificate[] certs, String authType) {
                }
            }
        };
 
        try {
            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
        } catch (Exception e) {
        }
    }

    @Bean
    public ViewResolver getViewResolver() {
        final InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix("/WEB-INF/");
        resolver.setSuffix(".html");
        return resolver;
    }
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/assets/**").addResourceLocations("/WEB-INF/app/assets/");
        registry.addResourceHandler("/bower_components/**").addResourceLocations("/WEB-INF/app/bower_components/");
        registry.addResourceHandler("/js/**").addResourceLocations("/WEB-INF/app/js/");
        registry.addResourceHandler("/lib/**").addResourceLocations("/WEB-INF/app/lib/");
        registry.addResourceHandler("/partials/**").addResourceLocations("/WEB-INF/app/partials/");
        registry.addResourceHandler("/index.html").addResourceLocations("/WEB-INF/index.html");
    }

    @Bean
    public ObjectMapper getObjectMapper() {
        final ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);
        return objectMapper;
    }

}
