define(['angular',
	'router',
	'restangular',
	'services/services',
	'directives/directives',
	'providers/providers',
	'filters/filters',
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
		'controllers',
		'directive.table',
		'ui.bootstrap'
	]).config(function(RestangularProvider, appUrlManipulationProvider, REST_API) {
		console.log('app.js called');

        RestangularProvider.setDefaultHeaders({ 
			"Content-Type" : "application/json;charset=UTF-8",
			"Accept" :"application/json;charset=UTF-8" });
		RestangularProvider.setBaseUrl(REST_API);
		RestangularProvider.setListTypeIsArray(false);
		RestangularProvider.setResponseExtractor(function(response, operation, what, url) {
			if (operation === "getList") {
				if (angular.isArray(response.content)) {
					angular.forEach(response.content, function(content, key) {
						appUrlManipulationProvider.entityId(content);
					});
				} else {
					appUrlManipulationProvider.entityId(response);
				}
			} else if (operation == "get") {
				if (angular.isObject(response))
					appUrlManipulationProvider.entityId(response);
			} else if (operation == "post") {
				if (angular.isObject(response))
					appUrlManipulationProvider.entityId(response);
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
