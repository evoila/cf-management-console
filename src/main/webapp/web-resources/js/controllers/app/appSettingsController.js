/**
 * AppSettingsController
 **/

define(function () {
	'use strict';	
	
	function AppSettingsController($scope, $state, $modal, $location, Restangular, responseService) {
		$scope.loading = true;
		$scope.organizationId = $state.params.organizationId;

		Restangular.one('applications', $state.params.applicationId).get().then(function (application) {
				$scope.application = application;
				$scope.loading = false;
		});

		$scope.deleteApplication = function() {

			var modalInstance = $modal.open({
				templateUrl : 'partials/general/delete.html',
				controller: 'deleteController'
			});

			modalInstance.result.then(function (response) {
				$scope.loading = true;
				Restangular.one('applications', $scope.application.metadata.guid).remove().then(function (data, status, headers) {							
						$location.path('/app-spaces/' + $scope.organizationId);
						responseService.executeSuccess(data, null, null);
					},function (data, status, headers) {
						$scope.error = 'Failed to load organization. Reason: ' + data.code + ' - ' + data.description;
						responseService.executeError(data, status, headers, $scope, 'organization');
				});
			});
		};
	}

	AppSettingsController.$inject = ['$scope', '$state', '$modal', '$location', 'Restangular', 'responseService'];

	return AppSettingsController;
});