require({
	paths: {
		angular : '../lib/angular/angular',		
		underscore : '../lib/underscore/underscore.min',
		domReady : '../lib/require/domReady',
		router : '../lib/ui-router/angular-ui-router',
		restangular : '../lib/restangular/restangular',
		angularui : '../lib/angularui/ui-bootstrap',
	},
	shim: {
		'angular' : {'exports' : 'angular'},
        'angularui': {'deps' : ['angular']},
		'router' : { 'deps' : ['angular']},
		'underscore' : {'exports' : '_'},
		'restangular' : { 'deps' : ['angular']}
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
