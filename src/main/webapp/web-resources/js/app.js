define(['angular',
	'states',
	'restangular',
	'services/services',
	'directives/directives',
	'providers/providers',
	'filters/filters',
	'controllers/controllers',
	'directives/tableDirective',
	'directives/angular-ui/ui-bootstrap-0.6.0'],
	function (angular) {

	'use strict';

	return angular.module('myApp', [
		'ui.compat',
		'restangular',
		'services',
		'directives',
		'providers',
		'filters',
		'controllers',
		'directive.table',
		'ui.bootstrap'
	]).config(function($httpProvider, RestangularProvider) {
		console.log('app.js called');

		var entityId = function(entity) {
			var link = relations(entity, 'self');
			if (link != undefined) {
				var id = link.href.substring(link.href.lastIndexOf('/') + 1, link.href.length);
				if (!isNaN(parseFloat(id)) && isFinite(id))
					entity.id = Number(id);
				else
					entity.id = id;
			}
			return entity;
		};

		var relations = function(entity, relation) {
			if (entity.links !== undefined) {
				if (entity.links.length > 0) {
					for (var i = 0; i < entity.links.length; i++) {
						var position = -1;
						if (entity.links[i].rel !== 'self') {
							position = entity.links[i].rel.lastIndexOf('.') + 1;
						} else {
							position = 0;
						}
						var length = entity.links[i].rel.length;
						if (position !== -1) {
							var rel = entity.links[i].rel.substring(position, length);
							if (rel === relation) {
								return entity.links[i];
							}
						}
					}
				}
				return undefined;
			}
		};

		$httpProvider.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';
		$httpProvider.defaults.headers.common['Accept'] = 'application/json;charset=UTF-8';
		
		RestangularProvider.setBaseUrl("/api");
		RestangularProvider.setListTypeIsArray(false);
		
		RestangularProvider.setResponseExtractor(function(response, operation, what, url) {
			if (operation === "getList") {
				if (angular.isObject(response.content) && angular.isArray(response.content)) {
					angular.forEach(response.content, function(content, key) {
						entityId(content);
					});
				}
			} else if (operation == "get") {
				if (angular.isObject(response))
					entityId(response);
			} else if (operation == "post") {
				if (angular.isObject(response))
					entityId(response);
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

		

	});
});
