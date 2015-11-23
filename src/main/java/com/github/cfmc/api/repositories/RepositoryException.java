package com.github.cfmc.api.repositories;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 *
 * @author Johannes Hiemer
 *
 */
public class RepositoryException extends RuntimeException {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private final ResponseEntity<?> response;
	
	private final HttpStatus httpStatus;

    public RepositoryException(String message) {
        super(message);
        this.response = null;
        this.httpStatus = response.getStatusCode();
    }

    public RepositoryException(String message, Throwable cause) {
        super(message, cause);
        this.response = null;
        this.httpStatus = response.getStatusCode();
    }

    public RepositoryException(String message, ResponseEntity<?> response) {
        super(message);
    	this.response = response;
    	this.httpStatus = response.getStatusCode();
    }

    public RepositoryException(String message, ResponseEntity<?> response, HttpStatus httpStatus) {
		super();
		this.response = response;
		this.httpStatus = httpStatus;
	}
    
	public HttpStatus getHttpStatus() {
		return httpStatus;
	}

	public ResponseEntity<?> getResponse() {
        return response;
    }

}
