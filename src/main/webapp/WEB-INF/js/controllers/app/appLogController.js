/**
 * AppLogController
 **/

define(function () {
	'use strict';	
	
	function AppLogController($scope, $state, Restangular) {
		$scope.loading = true;

		var applicationId = $state.params.applicationId;
		var instanceId = $state.params.instanceId;
		var fileName = $state.params.fileName;

		Restangular.one('applications', applicationId).one('instances', instanceId).one('logs', fileName).get()
			.then(function (data) {
			$scope.log = data;
			$scope.loading = false;
		});
	}

	AppLogController.$inject = ['$scope', '$state', 'Restangular'];

	return AppLogController;
});