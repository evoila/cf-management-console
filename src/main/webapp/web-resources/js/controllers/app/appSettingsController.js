/**
 * AppSettingsController
 **/

define(function () {
	'use strict';	
	
	function AppSettingsController($scope) {
		$scope.loading = true;
		$scope.organizationId = $stateParams.organizationId;

		var applicationPromise = cloudfoundry.getApplication($stateParams.applicationId);
		applicationPromise.success(function (application, status, headers) {
			$scope.application = application;
			$scope.loading = false;
		});
		applicationPromise.error(function (data, status, headers) {
			$scope.forceLogin(status);
			$scope.error = 'Failed to load application. Reason: ' + data.code + ' - ' + data.description;
			$scope.loading = false;
		});

		$scope.deleteApplication = function() {
			var applicationPromise = cloudfoundry.deleteApplication($scope.application.metadata.guid);
			applicationPromise.success(function (services, status, headers) {
				$location.path('/app-spaces/' + $scope.organizationId);
			});
			applicationPromise.error(function (data, status, headers) {
				$scope.error = 'Failed to delete application. Reason: ' + data.code + ' - ' + data.description;
			});
		}
	}

	AppSettingsController.$inject = ['$scope'];

	return AppSettingsController;
});