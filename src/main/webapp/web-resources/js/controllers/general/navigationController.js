/**
 * NavigationController
 **/

define(function () {
	'use strict';	
	
	function NavigationController($scope, Restangular, clientCacheService, $location, $stateParams) {
		
		$scope.logout = function () {
			clientCacheService.logout();
			$location.path('/login');
		}

		$scope.loadingData = true;
		$scope.isAuthenticated = clientCacheService.isAuthenticated();

		if (clientCacheService.isAuthenticated()) {
			Restangular.all('organizations').getList().then(function(data) {
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
		} else {
			$scope.forceLogin(status);
		}
	}

	NavigationController.$inject = ['$scope', 'Restangular', 'clientCacheService', '$location', '$stateParams'];

	return NavigationController;
});