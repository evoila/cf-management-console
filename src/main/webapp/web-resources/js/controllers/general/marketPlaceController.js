/**
 * MarketPlaceController
 **/

define(function () {
	'use strict';	
	
	function MarketPlaceController($scope) {
		var servicesPromise = cloudfoundry.getServices();
		servicesPromise.success(function (data, status, headers) {
			$scope.services = data;
		});
		servicesPromise.error(function (data, status, headers) {
			$scope.forceLogin(status);
			$scope.error = 'Failed to load services. Reason: ' + data.code + ' - ' + data.description;
		});
	}

	MarketPlaceController.$inject = ['$scope'];

	return MarketPlaceController;
});