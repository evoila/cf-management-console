/**
 * MarketPlaceController
 **/
angular.module('controllers')
  .controller('marketplaceController',
    function MarketplaceController($scope, $state, menu, Restangular, DesignService) {
      $scope.org = menu.organization;
      $scope.orgId = $state.params.organizationId;

      Restangular.all('services').getList().then(function(services) {
        $scope.services = services;
      });

      $scope.showDetails = function(service) {
        $state.go('service-details', {organizationId : $scope.orgId, serviceId : service.metadata.guid, service : service});
      };

      $scope.colorString = function(name) {
        var myColor = DesignService.stringColor(name);
        return myColor;
      };

      $scope.servicePng = function(name) {
        var myService = DesignService.resolveServicePng(name);
        return myService;
      };
});
