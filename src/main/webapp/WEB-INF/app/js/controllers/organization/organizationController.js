/**
 * OrganizationController
 **/


angular.module('controllers')
  .controller('organizationController',
    function OrganizationController($scope, $state, Restangular) {
      $scope.DEBUG = true;

      Restangular.one('organizations', $state.params.organizationId).get().then(function(data, status, headers) {
        $scope.organization = data;
      });
    });
