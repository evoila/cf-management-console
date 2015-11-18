/**
 *  route.js
 **/
angular.module('routes', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/spaces");

    $stateProvider
      .state('app', {
        url: '/organizations/:organizationId/space/:spaceId/applications/:applicationId/',
        templateUrl: 'partials/application/app.html',
        controller: 'appController'
      })
      .state('org-create', {
        url: '/organizations',
        templateUrl: 'partials/organization/organization-create.html',
        controller: 'organizationController'
      })
      .state('org-settings', {
        url: '/organizations/:organizationId/settings',
        templateUrl: 'partials/org/org-settings.html',
        controller: 'organizationController'
      })
      .state('spaces', {
        url: "/organizations/:organizationId/spaces",
        templateUrl: "partials/space/space-list.html",
        controller: 'spacesController',
      })
      .state('space', {
        url: "/organizations/:organizationId/spaces/:spaceId",
        templateUrl: "partials/space/space.html",
        controller: 'spaceController',
      })
      .state('space-create', {
        url: '/organizations/:organizationId/spaces/create',
        templateUrl: 'partials/space/space-create.html',
        controller: 'spaceController'
      })
      .state('space-settings', {
        url: '/organizations/:organizationId/spaces/:spaceId/settings',
        templateUrl: 'partials/space/space-settings.html',
        controller: 'spaceController'
      })
      .state('marketplace', {
        url: '/organizations/:organizationId/marketplace',
        templateUrl: 'partials/marketplace/marketplace.html',
        controller: 'marketplaceController'
      })
      .state('service', {
        url: '/organizations/:organizationId/spaces/:spaceId/services',
        templateUrl: 'partials/service/service.html',
        controller: 'servicesController'
      })
      .state('service-details', {
        url: '/organizations/:organizationId/services/:serviceId/details',
        templateUrl: 'partials/marketplace/service-details.html',
        params: {
          service: null
        }
      })
      .state('users', {
        url: '/organizations/:organizationId/users',
        templateUrl: 'partials/user/user-list.html',
        controller: 'usersController'
      })
      .state('user-edit', {
        url: '/organizations/:organizationId/users/:userId/edit',
        templateUrl: 'partials/user/user-edit.html',
        params: {
          user: null
        }
      })
      .state('user-info', {
        url: '/organizations/:organizationId/users/:userId/info',
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
