/**
 *  route.js
 **/
angular.module('routes', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/spaces");

    $stateProvider
      .state('app-log', {
        url: '/orgs/:organizationId/apps/:applicationId/instances/:instanceId/files/:fileName/log',
        templateUrl: 'partials/app/app-log.html',
        controller: 'appLogController'
      })
      .state('app-settings', {
        url: '/orgs/:organizationId/apps/:applicationId/app-settings/',
        templateUrl: 'partials/app/app-settings.html',
        controller: 'appSettingsController'
      })

      .state('org-create', {
        url: '/org/:organizationId',
        templateUrl: 'partials/create-org.html',
        controller: 'organizationController'
      })
      .state('org-settings', {
        url: '/org/:organizationId/settings',
        templateUrl: 'partials/org/org-settings.html',
        controller: 'organizationController'
      })
      .state('spaces', {
        url: "/org/:organizationId/spaces",
        templateUrl: "partials/space/space-list.html",
        controller: 'spacesController',
      })
      .state('space', {
        url: "/org/:organizationId/spaces/:spaceId",
        templateUrl: "partials/space/space.html",
        controller: 'spaceController',
      })
      .state('space-create', {
        url: '/org/:organizationId/spaces/create',
        templateUrl: 'partials/space/space-create.html',
        controller: 'spaceController'
      })
      .state('space-settings', {
        url: '/org/:organizationId/spaces/:spaceId/settings',
        templateUrl: 'partials/space/space-settings.html',
        controller: 'spaceController'
      })
      .state('marketplace', {
        url: '/org/:organizationId/marketplace',
        templateUrl: 'partials/marketplace/marketplace.html',
        controller: 'marketplaceController'
      })
      .state('user-create', {
        url: '/org/:organizationId/user/:userId',
        templateUrl: 'partials/user/users.html',
        controller: 'organizationUserController'
      })
      .state('users', {
        url: '/org/:organizationId/users',
        templateUrl: 'partials/user/user-list.html',
        controller: 'usersController'
      })
      .state('user-info', {
        url: '/org/:organizationId/user/:userId/info',
        templateUrl: 'partials/user/user-info.html',
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
  })
  .filter('nospace', function() {
    return function(value) {
      return (!value) ? '' : value.replace(/ /g, '');
    };
  })
  //replace uppercase to regular case
  .filter('humanizeDoc', function() {
    return function(doc) {
      if (!doc) return;
      if (doc.type === 'directive') {
        return doc.name.replace(/([A-Z])/g, function($1) {
          return '-' + $1.toLowerCase();
        });
      }

      return doc.label || doc.name;
    };
  });
