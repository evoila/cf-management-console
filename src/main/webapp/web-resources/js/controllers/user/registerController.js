/**
 * RegisterController
 **/

define(function () {
	'use strict';	
	
	function RegisterController($scope) {
		$scope.register = function(userForm) {
			$scope.success = '';
			$scope.error = '';

			var registrationPromise = cloudfoundry.register(userForm);
			registrationPromise.success(function (data, status, headers) {
				$scope.success = 'Registration successful! Your user is active, ask an organization manager to add you to an organization.';
			});
			registrationPromise.error(function (data, status, headers) {
				$scope.error = 'Registration failed. Reason: ' + data.message;
			});
		}
	}

	RegisterController.$inject = ['$scope'];

	return RegisterController;
});