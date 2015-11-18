/**
 * 
 */
package com.github.cfmc.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.HttpClientErrorException;

import com.github.cfmc.api.repositories.RepositoryException;

/**
 * 
 * @author Johannes Hiemer
 *
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @SuppressWarnings({ "rawtypes", "unchecked" })
	@ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception ex) {
        LOGGER.debug("Handling exception of type {} with message {}", ex.getClass(), ex.getMessage());

        if (ex instanceof RepositoryException) {
            return new ResponseEntity<>(
				new ExceptionContainer(((RepositoryException) ex)
						.getResponse().getBody().toString()), 
				((RepositoryException) ex).getHttpStatus()
            );
        } if (ex instanceof HttpClientErrorException) {
        	return new ResponseEntity<>(
    			new ExceptionContainer(((HttpClientErrorException) ex)
    					.getResponseBodyAsString()), 
    			(((HttpClientErrorException) ex).getStatusCode())
        	);
    	} else {
        	return new ResponseEntity(
    			new ExceptionContainer(ex.getMessage()), 
    			HttpStatus.INTERNAL_SERVER_ERROR
        	);
        }
    }

}
