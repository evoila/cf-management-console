/**
 * NavigationController
 **/

define(function () {
	'use strict';	
	
	function NavigationController($scope, Restangular, clientStorage, $location) {
		
		$scope.logout = function () {
			clientStorage.logout();
			$location.path('/login');
		}

		$scope.loadingData = true;
		$scope.isAuthenticated = clientStorage.isAuthenticated();

		if (clientStorage.isAuthenticated()) {
			var organizationsPromise = cloudfoundry.getOrganizations();
			organizationsPromise.success(function (data, status, headers) {
				angular.forEach(data, function (organization, organizationIndex) {
					if (organization.id == $stateParams.organizationId) {
						organization.selected = true;
						$scope.organization = organization;
					}
				});
				$scope.user = cache.getUser();
				$scope.organizations = data;
				$scope.loadingData = false;
			});
			organizationsPromise.error(function (data, status, headers) {
				$scope.forceLogin(status);
			});
		}
	}

	NavigationController.$inject = ['$scope', 'Restangular', 'clientStorage', '$location'];

	return NavigationController;
});