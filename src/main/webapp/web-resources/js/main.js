require({
	paths: {
		angular : '../lib/angular/angular',
		resource : '../lib/angular/angular-resource.min',
		underscore : '../lib/underscore/underscore.min',
		domReady : '../lib/require/domReady',
		states : '../lib/angular-ui/angular-ui-states',
		restangular : '../lib/restangular/restangular',
		moment : '../lib/moment/moment',
		marked : '../lib/marked/marked',
		highlight : '../lib/highlight/highlight',
		highcharts : '../lib/highchart/highchart',
		stomp : '../lib/stomp/stomp'
	},
	shim: {
		'angular' : {'exports' : 'angular'},
		'states' : { 'deps' : ['angular']},
		'underscore' : {'exports' : '_'},
		'highcharts' : { 'exports' : 'Highcharts'}
	},
	priority: [
		'angular'
	],
	urlArgs: 'v=0.1'
}, ['app', 
	'angular', 
	'routes', 
	'bootstrap', 
	'controllers/controllers', 
	'services/services', 
	'directives/directives', 
	'providers/providers', 
	'filters/filters', 
	'moment', 'highcharts', 'marked', 'highlight'], function (app) {
		app.run(['$rootScope', '$state', '$stateParams', 'clientCacheService',
			function ($rootScope, $state, $stateParams, clientCacheService) {
				console.log('main.js - called');

				$rootScope.forceLogin = function(status){
					if(status === 401){
						clientCacheService.logout();
						$location.path('/login')
					}
				};
		}]);

});
