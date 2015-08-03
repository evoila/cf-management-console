/**
 * HomeController
 **/
 
define(function () {
	'use strict';
	
	function HomeController($scope, Restangular, clientCacheService, $location) {
		
		if (!clientCacheService.isAuthenticated()) {
			if ($location.path() != '/login' && $location.path() != '/register') {
				$location.path('/login');
			}
		}
		
		if ($location.path() === '/' || $location.path().length === 0) {
			Restangular.all('organizations').getList().then(function(organisations) {
				$location.path('/app-spaces/' + organisations[0].id);
			}, function(response) {
				clientCacheService.clear;
				$location.path('/login');
			});			
		}
	}

	HomeController.$inject = ['$scope', 'Restangular', 'clientCacheService', '$location'];

	return HomeController;
});
