/**
 * MarketPlaceController
 **/

define(function () {
	'use strict';	
	
	function MarketPlaceController($scope, Restangular) {

		Restangular.all('services').get().then(function (services) {
			$scope.services = application;				
		});
	}

	MarketPlaceController.$inject = ['$scope', 'Restangular'];

	return MarketPlaceController;
});