/**
 *  route.js
 **/
define(['app'], function (app) {
	return app.config(['$stateProvider', '$routeProvider', '$urlRouterProvider', 
		function($stateProvider, $routeProvider, $urlRouterProvider) {
		console.log('routes.js - called', app);
		
		var navigation = {
			templateUrl: 'partials/navigation.html',
			controller: 'navigationController'
		};

		$stateProvider.state('app-log', {
			url: '/app-log/:organizationId/:applicationId/instances/:instanceId/:fileName',
			views: {
				'navigation': navigation,		
				'body': {
					templateUrl: 'partials/app-log.html',
					controller: 'appLogController'
				}
			}
		}).state('app-settings', {
			url: '/app-settings/:organizationId/applications/:applicationId',
			views: {
				'navigation': navigation,
				'body': {
					templateUrl: 'partials/app-settings.html',
					controller: 'appSettingsController'
				}
			}
		}).state('app-spaces', {
			url: '/app-spaces/:organizationId',
			views: {
				'navigation': navigation,
				'body': {
					templateUrl: 'partials/app-spaces.html',
					controller: 'appSpacesController'
				}
			}
		}).state('create-org', {
			url: '/create-org/:organizationId',
			views: {
				'navigation': navigation,
				'body': {
					templateUrl: 'partials/create-org.html',
					controller: 'organisationController'
				}
			}
		}).state('create-space', {
			url: '/create-space/:organizationId',
			views: {
				'navigation': navigation,
				'body': {
					templateUrl: 'partials/create-space.html',
					controller: 'spaceController'
				}
			}
		}).state('marketplace', {
			url: '/marketplace/:organizationId',
			views: {
				'navigation': navigation,
				'body': {
					templateUrl: 'partials/marketplace.html',
					controller: 'marketPlaceController'
				}
			}
		}).state('org-settings', {
			url: '/org-settings/:organizationId',
			views: {
				'navigation': navigation,
				'body': {
					templateUrl: 'partials/org-settings.html',
					controller: 'organisationController'
				}
			}
		}).state('space-settings', {
			url: '/space-settings/:organizationId/spaces/:spaceId',
			views: {
				'navigation': navigation,
				'body': {
					templateUrl: 'partials/space-settings.html',
					controller: 'spaceController'
				}
			}
		}).state('newUsers', {
			url: '/organization/:organizationId/users',
			views: {
				'navigation': navigation,
				'body': {
					templateUrl: 'partials/org-users.html',
					controller: 'organisationUserController'
				}
			}
		}).state('users', {
			url: '/users/:organizationId',
			views: {
				'navigation': navigation,
				'body': {
					templateUrl: 'partials/users.html',
					controller: 'usersController'
				}
			}
		}).state('userinfo', {
			url: '/userinfo/:organizationId',
			views: {
				'navigation': navigation,
				'body': {
					templateUrl: 'partials/user-info.html',
					controller: 'userInfoController'
				}
			}
		}).state('login', {
			url: '/login',
			views: {
				'navigation': navigation,
				'body': {
					templateUrl: 'partials/login.html',
					controller: 'loginController'
				}
			}
		}).state('register', {
			url: '/register',
			views: {
				'navigation': navigation,
				'body': {
					templateUrl: 'partials/register.html',
					controller: 'registerController'
				}
			}
		});
	}]);
});
