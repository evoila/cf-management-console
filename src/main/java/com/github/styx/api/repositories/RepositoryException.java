package com.github.styx.api.repositories;

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

    public RepositoryException(String message) {
        super(message);
        response = null;
    }

    public RepositoryException(String message, Throwable cause) {
        super(message, cause);
        response = null;
    }

    public RepositoryException(String message, ResponseEntity<?> response) {
        super(message);
        this.response = response;
    }

    public ResponseEntity<?> getResponse() {
        return response;
    }

}
