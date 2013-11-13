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
		stomp : '../lib/stomp/stomp',
	},
	shim: {
		'angular' : {'exports' : 'angular'},
		'states' : { 'deps' : ['angular']},
		'underscore' : {'exports' : '_'},
		'highcharts' : { 'exports' : 'Highcharts'},		
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
		app.run(['$rootScope', '$state', '$stateParams', 
			function ($rootScope, $state, $stateParams) {
				console.log('main.js - called');
				$rootScope.forceLogin = function(status){
					if(status === 401){
						cloudfoundry.logout();
						$location.path('/login')
					}
				}
				$rootScope.defaultSpinnerConfig = {
					lines: 17, // The number of lines to draw
					length: 14, // The length of each line
					width: 2, // The line thickness
					radius: 24, // The radius of the inner circle
					corners: 1, // Corner roundness (0..1)
					rotate: 0, // The rotation offset
					direction: 1, // 1: clockwise, -1: counterclockwise
					color: '#000', // #rgb or #rrggbb
					speed: 1.8, // Rounds per second
					trail: 58, // Afterglow percentage
					shadow: false, // Whether to render a shadow
					hwaccel: false, // Whether to use hardware acceleration
					className: 'spinner', // The CSS class to assign to the spinner
					zIndex: 2e9, // The z-index (defaults to 2000000000)
					top: '50px' // Top position relative to parent in px
			//        left: '110px' // Left position relative to parent in px
				};
		}]);

});
