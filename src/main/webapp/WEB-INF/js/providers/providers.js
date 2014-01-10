/**
 * provider.js
 **/
 
define(['angular', 'providers/auth/authenticationProvider'], 
 	function (angular, AuthenticationProvider) {
 		
 		var providers = angular.module('providers', []);

 		providers.provider('authenticationProvider', AuthenticationProvider);
 });