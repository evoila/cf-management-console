/**
 * 
 */
package de.evoila;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.embedded.FilterRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.util.Assert;

import de.evoila.cfmc.cors.CORSFilter;

/**
 * 
 * @author Johannes Hiemer.
 *
 */
@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		ApplicationContext ctx = SpringApplication.run(Application.class, args);

		Assert.notNull(ctx);
	}
	
	@Bean
    public FilterRegistrationBean someFilterRegistration() {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(new CORSFilter());
        registration.addUrlPatterns("/*");
        registration.setName("corsFilter");
        return registration;
    }

}