/**
 * 
 */
package com.github.config;

import javax.servlet.Filter;
import javax.servlet.FilterRegistration;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration.Dynamic;

import org.springframework.web.multipart.support.MultipartFilter;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

import com.github.config.web.CustomMvcConfiguration;
import com.github.config.web.cors.CORSFilter;

/**
 * 
 * @author Johannes Hiemer.
 * 
 */
public class CustomWebInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {
	
	@Override
	protected Class<?>[] getRootConfigClasses() {
		return new Class<?>[] { };
	}

	@Override
	protected Class<?>[] getServletConfigClasses() {
		return new Class<?>[] { CustomMvcConfiguration.class };
	}

	@Override
	protected String[] getServletMappings() {
		return new String[] { "/" };
	}
	
	@Override
	protected Filter[] getServletFilters() {
		return new Filter[]{ new MultipartFilter()};
	}

	@Override
	protected void customizeRegistration(Dynamic registration) {
		registration.setInitParameter("dispatchOptionsRequest", "true");
		registration.setAsyncSupported(true);
	}

	@Override
	public void onStartup(ServletContext servletContext) throws ServletException {		       
		FilterRegistration.Dynamic corsFilter = servletContext.addFilter("corsFilter", CORSFilter.class);
        corsFilter.addMappingForUrlPatterns(null, false, "/*");
        
	    super.onStartup(servletContext);
	}

}