angular.module('controllers')
  .controller('routesController',
    function RoutesController($scope, $state, Restangular, menu, clientCacheService, responseService, $mdDialog, $location) {

      $scope.orgId = $state.params.organizationId;

      $scope.init = function() {
        /*
        Restangular.one('private_domains', $scope.orgId).getList().then(function(domains) {
          $scope.domains = domains;
        });
        */
      }

  });
