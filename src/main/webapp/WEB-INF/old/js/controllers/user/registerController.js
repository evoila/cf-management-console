/**
 * RegisterController
 **/

define(function () {
	'use strict';	
	
	function RegisterController($scope, $http, responseService, REST_API) {
		
		$scope.register = function(userForm) {
			var head = {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8', 'Accept': 'application/json;charset=utf-8'}};
			var data = $.param({'username': userForm.email, 'firstName': userForm.firstName, 'lastName': userForm.lastName, 'password': userForm.password});


			$http.post(REST_API + '/users', data, head).success(function(data, status, headers, config) {
					responseService.executeSuccess(data, headers, 'dashboard');
				}).error(function(data, status, headers, config) {					
					responseService.executeError(data, status, headers, $scope, 'user');
			});			
		};
	}

	RegisterController.$inject = ['$scope', '$http', 'responseService', 'REST_API'];

	return RegisterController;
});