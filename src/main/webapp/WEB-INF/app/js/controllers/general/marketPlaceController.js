/**
 * MarketPlaceController
 **/
angular.module('controllers')
  .controller('marketplaceController',
    function MarketplaceController($scope, $state, menu, Restangular) {

      $scope.org = menu.organization;
      $scope.orgId = $scope.org.metadata.guid;

      Restangular.all('services').getList().then(function(services) {
        $scope.services = services;
      }, function(response) {
          responseService.executeError(response, null, null, $scope, 'service');
      });

      $scope.showDetails = function(service) {
        $state.go('service-details', {organizationId : $scope.orgId, serviceId : service.metadata.guid, service : service});
      };












    });
