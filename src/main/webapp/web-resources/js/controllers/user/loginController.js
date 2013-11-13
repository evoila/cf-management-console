/**
 * LoginController
 **/

define(function () {
	'use strict';	
	
	function LoginController($scope) {
		$scope.authenticating = false;
		$scope.login = function (userForm) {
			$scope.authenticating = true;
			var authenticationPromise = cloudfoundry.authenticate(userForm);
			authenticationPromise.success(function (data, status, headers) {
				var organizationPromise = cloudfoundry.getOrganizations();
				organizationPromise.success(function (data, status, headers) {
					if (data.length > 0) {
						$location.path('/app-spaces/' + data[0].id);
					} else {
						$scope.error = 'You are not associated with any organization, please ask an organization manager to add you an organization.';
						$scope.authenticating = false;
					}
				});
				organizationPromise.error(function (data, status, headers) {
					$scope.error = 'Invalid user credentials';
					$scope.authenticating = false;
				});
			});
			authenticationPromise.error(function (data, status, headers) {
				$scope.error = 'Invalid user credentials';
				$scope.authenticating = false;
			});
		}
	}

	LoginController.$inject = ['$scope'];

	return LoginController;
});