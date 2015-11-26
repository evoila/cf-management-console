angular.module('controllers')
  .controller('routeController',
    function RouteController($scope, $state, Restangular, menu, clientCacheService, responseService, $mdDialog, $location) {

      $scope.orgId = $state.params.organizationId;

      $scope.init = function() {
        /*
        Restangular.one('private_domains', $scope.orgId).getList().then(function(domains) {
          $scope.domains = domains;
        });
        */
      }

  });
