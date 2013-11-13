/**
 * HomeController
 **/
 
define(function () {
	'use strict';
	
	function HomeController($scope, Restangular, clientStorage, $location, $route) {
		
		if (!clientStorage.isAuthenticated()) {
			if ($location.path() != '/login' && $location.path() != '/register') {
				$location.path('/login');
				return;
			}
		}
		
		if ($location.path() === '/' || $location.path().length === 0) {
			Restangular.all('organizations').getList().then(function(organisations) {
				$location.path('/app-spaces/' + organisations[0].id);
			}, function(response) {
				clientStorage.clear;
				$location.path('/login');
			});			
		} else {
			$route.reload();
		}
	}

	HomeController.$inject = ['$scope', 'Restangular', 'clientStorage', '$location', '$route'];

	return HomeController;
});
