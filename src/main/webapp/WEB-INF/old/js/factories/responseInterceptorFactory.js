/**
 * ResponseInterceptor
 **/

 define(['angular'], function (angular) {
	"use strict";

	var interceptor = function($q, $rootScope, $location, clientCacheService) {
		return {
			response: function(response) {
				// response.status === 200
				return response || $q.when(response);
			},
			responseError: function(rejection) {
				// Executed only when the XHR response has an error status code				
				if (rejection.status == 401) {

					// The interceptor "blocks" the error;
					// and the success callback will be executed.					
					clientCacheService.clear();
					$location.path('/login');
					
					return rejection;
				}

				/*
				  $q.reject creates a promise that is resolved as
				  rejected with the specified reason. 
				  In this case the error callback will be executed.
				*/
				
				return $q.reject(rejection);
			}
		}
	};
	
	interceptor.inject = ['$q', '$rootScope', '$location', 'clientCacheService'];

	return interceptor;
});
