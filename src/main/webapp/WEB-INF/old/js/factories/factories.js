/**
 * provider.js
 **/
 
define(['angular', 
		'factories/responseInterceptorFactory'], 
 	function (angular, responseInterceptorFactory) {
 		
 		var factories = angular.module('factories', []);

 		factories.factory('responseInterceptor', responseInterceptorFactory);
 });