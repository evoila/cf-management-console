/**
 * MarketPlaceController
 **/


angular.module('controllers')
  .controller('marketplaceController',
    function MarketplaceController($scope, Restangular) {

      $scope.service = null;

      Restangular.all('services').getList().then(function(services) {
        $scope.services = services;
      });

      $scope.showDetails = function(service) {
        $scope.service = service;
      };

      return MarketplaceController;
    });
