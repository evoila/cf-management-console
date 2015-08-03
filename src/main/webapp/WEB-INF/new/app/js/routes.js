/**
 *  route.js
 **/
angular.module('routes', ['ui.router']).config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('app-log', {
      url: '/app-log/:organizationId/applications/:applicationId/instances/:instanceId/:fileName',
      templateUrl: 'partials/app-log.html',
      controller: 'appLogController'
    })
    .state('app-settings', {
      url: '/app-settings/:organizationId/applications/:applicationId',
      templateUrl: 'partials/app-settings.html',
      controller: 'appSettingsController'
    })
    .state('app-spaces', {
      url: "/app-spaces/:organizationId",
      templateUrl: "partials/app-spaces.html",
      controller: 'appSpacesController',
    })
    .state('create-org', {
      url: '/create-org/:organizationId',
      templateUrl: 'partials/create-org.html',
      controller: 'organizationController'
    })
    .state('create-space', {
      url: '/create-space/:organizationId',
      templateUrl: 'partials/create-space.html',
      controller: 'spaceController'
    })
    .state('marketplace', {
      url: '/marketplace/:organizationId',
      templateUrl: 'partials/marketplace.html',
      controller: 'marketPlaceController'
    })
    .state('org-settings', {
      url: '/org-settings/:organizationId',
      templateUrl: 'partials/org-settings.html',
      controller: 'organizationController'
    })
    .state('space-settings', {
      url: '/space-settings/:organizationId/spaces/:spaceId',
      templateUrl: 'partials/space-settings.html',
      controller: 'spaceController'
    })
    .state('create-user', {
      url: '/organization/:organizationId/users',
      templateUrl: 'partials/org-users.html',
      controller: 'organizationUserController'
    })
    .state('users', {
      url: '/users/:organizationId',
      templateUrl: 'partials/users.html',
      controller: 'usersController'
    })
    .state('userinfo', {
      url: '/userinfo/:organizationId',
      templateUrl: 'partials/user-info.html',
      controller: 'userInfoController'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'partials/login.html',
      controller: 'loginController'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'partials/register.html',
      controller: 'registerController'
    });
});
