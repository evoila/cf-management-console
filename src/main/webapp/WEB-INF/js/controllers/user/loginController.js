/**
 * LoginController
 **/

define(function () {
	'use strict';	
	
	function LoginController($scope, Restangular, clientCacheService, $location, $http, responseService) {
		$scope.authenticating = false;

		
		$scope.login = function (userForm) {
			$scope.authenticating = true;
            
			var data = $.param({'grant_type': 'password', 'username': userForm.email, 'password': userForm.password});
			var head = { headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8', 
				'Accept': 'application/json;charset=utf-8'}
			};

		    $http.post('/api/login', data, head).success(function(data, status, headers, config) {
			    	clientCacheService.authenticate(data);

			    	$http.defaults.headers.common['Authorization'] = 'bearer ' + clientCacheService.getUser().accessToken;
			    	
					Restangular.all('organizations').getList().then(function(data) {						
						if (data.length > 0) {
							responseService.executeSuccess(data, headers, 'dashboard');
							$location.path('/app-spaces/' + data[0].id);
						} else {
							data = 'You are not associated with any organization, please ask an organization manager to add you an organization.';
							$scope.authenticating = false;
							responseService.executeError(data, status, headers, $scope, 'user');
						}
					});				
			}).error(function (data, status, headers) {
				data = 'Invalid user credentials';
				$scope.authenticating = false;
				responseService.executeError(data, status, headers, $scope, 'user');
			});
		};
	}

	LoginController.$inject = ['$scope', 'Restangular', 'clientCacheService', '$location', '$http', 'responseService'];

	return LoginController;
});