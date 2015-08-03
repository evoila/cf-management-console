/**
 * MarketPlaceController
 **/

define(function () {
	'use strict';	
	
	function MarketPlaceController($scope, Restangular) {
		$scope.service = null;

		Restangular.all('services').getList().then(function (services) {
			$scope.services = services;				
		});

		$scope.showDetails = function(service) {
			$scope.service = service;
		};
	}

	MarketPlaceController.$inject = ['$scope', 'Restangular'];

	return MarketPlaceController;
});