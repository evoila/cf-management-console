/**
 *  route.js
 **/
angular.module('routes', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('application', {
        url: '/organizations/:organizationId/space/:spaceId/applications/:applicationId',
        templateUrl: 'partials/application/application.html',
        controller: 'applicationController'
      })
      .state('application-list', {
        url: '/organizations/:organizationId/space/:spaceId/applications',
        templateUrl: 'partials/application/application-list.html',
        controller: 'applicationListController'
      })
      .state('org-create', {
        url: '/organizations',
        templateUrl: 'partials/organization/organization-create.html',
        controller: 'organizationController'
      })
      .state('org-settings', {
        url: '/organizations/:organizationId/settings',
        templateUrl: 'partials/organization/org-settings.html',
        controller: 'organizationController'
      })
      .state('space-list', {
        url: "/organizations/:organizationId/spaces",
        templateUrl: "partials/space/space-list.html",
        controller: 'spaceListController'
      })
      .state('marketplace', {
        url: '/organizations/:organizationId/marketplace',
        templateUrl: 'partials/marketplace/marketplace.html',
        controller: 'marketplaceController'
      })
      .state('service-list', {
        url: '/organizations/:organizationId/spaces/:spaceId/services',
        templateUrl: 'partials/service/service-instance-list.html',
        controller: 'serviceInstanceListController',
        params: {
          space: null
        }
      })
      .state('service-details', {
        url: '/organizations/:organizationId/services/:serviceId/details',
        templateUrl: 'partials/marketplace/marketplace-service-details.html',
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
        templateUrl: 'partials/user/user-edit.html'
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
      })
      .state('domains', {
        url: '/organizations/:organizationId/private_domains',
        templateUrl: 'partials/domain/domain-list.html',
        controller: 'domainsController'
      })
      .state('routes', {
        url: '/organizations/:organizationId/routes',
        templateUrl: 'partials/route/route-list.html',
        controller: 'routesController'
      })

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
