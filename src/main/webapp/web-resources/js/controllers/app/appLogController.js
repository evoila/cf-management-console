/**
 * AppLogController
 **/

define(function () {
	'use strict';	
	
	function AppLogController($scope) {
		$scope.loading = true;

		var applicationId = $stateParams.applicationId;
		var instanceId = $stateParams.instanceId;
		var fileName = $stateParams.fileName;

		var logPromise = cloudfoundry.getApplicationLog(applicationId, instanceId, fileName);
		logPromise.success(function (data, status, headers) {
			$scope.log = data;
			$scope.loading = false;
		});
		logPromise.error(function (data, status, headers) {
			$scope.forceLogin(status);
			$scope.error = 'Failed to retrieve log file. Reason: ' + data.code + ' - ' + data.description;
			$scope.loading = false;
		});
	}

	AppLogController.$inject = ['$scope'];

	return AppLogController;
});