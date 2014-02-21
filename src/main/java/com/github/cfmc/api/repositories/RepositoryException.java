package com.github.cfmc.api.repositories;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * TODO: Add previous authors
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
        response = null;
        httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    public RepositoryException(String message, Throwable cause) {
        super(message, cause);
        response = null;
        httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    public RepositoryException(String message, ResponseEntity<?> response) {
        super(message);
        this.response = response;
        httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
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
