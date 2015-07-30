/**
 * MarketPlaceController
 **/


  angular.module('controllers')
  	.controller('marketPlaceController',
  		function MarketPlaceController($scope, Restangular) {

		$scope.service = null;

		Restangular.all('services').getList().then(function (services) {
			$scope.services = services;
		});

		$scope.showDetails = function(service) {
			$scope.service = service;
		};

	return MarketPlaceController;
});
