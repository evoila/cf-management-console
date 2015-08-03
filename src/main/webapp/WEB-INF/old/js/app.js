define(['angular',
	'router',
	'restangular',
	'services/services',
	'directives/directives',
	'providers/providers',
	'filters/filters',
	'factories/factories',
	'controllers/controllers',
	'directives/tableDirective',
	'angularui'],
	function (angular) {

	'use strict';

	return angular.module('myApp', [
		'ui.router.compat',
		'restangular',
		'services',
		'directives',
		'providers',
		'filters',
		'factories',
		'controllers',
		'directive.table',
		'ui.bootstrap'
	]).config(function(RestangularProvider, $httpProvider, appUrlManipulationProvider, REST_API) {
		console.log('app.js called');
		
		$httpProvider.interceptors.push('responseInterceptor');

        RestangularProvider.setDefaultHeaders({ 
			"Content-Type" : "application/json;charset=UTF-8",
			"Accept" :"application/json;charset=UTF-8" });
		RestangularProvider.setBaseUrl(REST_API);		
		RestangularProvider.setResponseExtractor(function(response, operation, what, url) {
			if (operation === "getList") {
				angular.forEach(response, function(item, index) {
					if (item.metadata != null && item.metadata.guid)
						item.entity.id = item.metadata.guid;
				});				
			} else if (operation == "get") {
				if (response.metadata != null && response.metadata.guid)
					response.entity.id = response.metadata.guid;
			} else if (operation == "post") {
				response.entity.id = response.metadata.guid;
			}
			return response;
		});

		RestangularProvider.setRequestInterceptor(function(request, operation, route) {
			if (operation === 'put') {
				if (request.links)
					delete request.links;
			}
			return request;
		});

	}).constant('REST_API', 'http://localhost:8080/cfmc/api');
});
