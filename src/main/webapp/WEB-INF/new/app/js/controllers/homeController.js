/**
 * HomeController
 **/

angular.module('controllers')
  .controller('homeController',
    function HomeController($scope, $state, Restangular, $location, $mdSidenav, $rootScope, clientCacheService, $mdSidenav) {

      $rootScope.isAuthenticated = clientCacheService.isAuthenticated();
      if (!clientCacheService.isAuthenticated()) {
        if ($location.path() != '/login' && $location.path() != '/register') {
          $location.path('/login');
        }
      } else {
        Restangular.all('organizations').getList().then(function(data) {
          $scope.organizations = data;
          $scope.organization = data[0];
          $location.path('/app-spaces/' + data[0].metadata.guid);
        }, function(response) {
          clientCacheService.clear;
          $location.path('/login');
        }).then(function() {
          $scope.$watch('organization', function(organization) {
            $state.go('app-spaces', {organizationId: organization.metadata.guid}, {
              reload: true
            });
          //  $location.path('/app-spaces/' + organization.metadata.guid);
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
