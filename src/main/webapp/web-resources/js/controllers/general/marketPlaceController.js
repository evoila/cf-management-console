/**
 * MarketPlaceController
 **/

define(function () {
	'use strict';	
	
	function MarketPlaceController($scope, Restangular) {

		Restangular.all('services').getList().then(function (services) {
			$scope.services = services;				
		});
	}

	MarketPlaceController.$inject = ['$scope', 'Restangular'];

	return MarketPlaceController;
});