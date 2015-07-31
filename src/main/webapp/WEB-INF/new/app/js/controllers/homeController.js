/**
 * HomeController
 **/

angular.module('controllers')
  .controller('homeController',
    function HomeController($scope, $state, Restangular, $location, $mdSidenav, $rootScope, clientCacheService, $mdSidenav) {
      $scope.state = $state;

      $rootScope.isAuthenticated = clientCacheService.isAuthenticated();
      console.debug($scope.isAuthenticated)
      if (!clientCacheService.isAuthenticated()) {
        if ($location.path() != '/login' && $location.path() != '/register') {
          $location.path('/login');
        }
      } else {
        Restangular.all('organizations').getList().then(function(data) {
          $scope.organizations = data;
          $scope.organization = data[0];
          $state.go('app-spaces', {
            organizationId: data[0].metadata.guid
          })
        }, function(response) {
          clientCacheService.clear;
          $location.path('/login');
        }).then(function() {
          $scope.$watch('organization', function(organization) {
            $state.go('app-spaces', {
              organizationId: organization.metadata.guid
            }, {
              reload: true
            });
          })
        });
      }

      $scope.logout = function() {
        $rootScope.isAuthenticated = false;
        clientCacheService.logout();
        $state.go('login', {}, {
          reload: true
        });
      };

      $scope.openMenu = function() {
        $mdSidenav('left').toggle();
      };
    });
