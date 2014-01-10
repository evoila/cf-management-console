require({
	paths: {
		angular : '../lib/angular/angular.min',
		resource : '../lib/angular/angular-resource.min',
		underscore : '../lib/underscore/underscore.min',
		domReady : '../lib/require/domReady',
		states : '../lib/angular-ui/angular-ui-states',
		restangular : '../lib/restangular/restangular',
		angularui : '../js/directives/angular-ui/ui-bootstrap-0.6.0',
        angularoverlay: '../lib/angular-overlay/wcAngularOverlay',
		stomp : '../lib/stomp/stomp'
	},
	shim: {
		'angular' : {'exports' : 'angular'},
        'resource': {'deps' : ['angular']},
		'states' : { 'deps' : ['angular']},
		'underscore' : {'exports' : '_'},
		'restangular' : { 'deps' : ['angular']},
		'angularui' : { 'deps' : ['angular']}
	},
	priority: [
		'angular'
	],
	urlArgs: 'v=1.1'
}, ['app', 
	'angular', 
	'routes', 
	'bootstrap', 
	'controllers/controllers', 
	'services/services', 
	'directives/directives', 
	'providers/providers',
	'filters/filters'], function (app) {
		app.run(['$rootScope', '$state', '$stateParams', 'clientCacheService', '$http',
			function ($rootScope, $state, $stateParams, clientCacheService, $http) {
				console.log('main.js - called');
				
				$rootScope.forceLogin = function(status) {
					if(status === 401) {
						clientCacheService.logout();
						$location.path('/login');
					}
				};
				
				if (clientCacheService.getUser() != null) {
					var token = clientCacheService.getUser().accessToken;
					$http.defaults.headers.common['Authorization'] = 'bearer ' + token;
				} else 
					$rootScope.forceLogin();

		}]);

});
