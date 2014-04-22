/**
 * AppSettingsController
 **/

define(function () {
	'use strict';	
	
	function AppSettingsController($scope, $state, $modal, $location, Restangular, responseService) {
		$scope.loading = true;
		$scope.organizationId = $state.params.organizationId;
		$scope.applicationId = null;

		Restangular.one('applications', $state.params.applicationId).get().then(function (application) {
			$scope.application = application;
			$scope.applicationId = $scope.application.id;
			$scope.loading = false;
		});

		Restangular.one('applications', $state.params.applicationId).all('instances').getList().then(function (instances) {
			$scope.instances = instances;
		})

		$scope.deleteApplication = function() {

			var modalInstance = $modal.open({
				templateUrl : 'partials/general/delete.html',
				controller: 'deleteController'
			});

			modalInstance.result.then(function (response) {
				$scope.loading = true;
				Restangular.one('applications', $scope.applicationId).remove().then(function (data, status, headers) {							
					$location.path('/app-spaces/' + $scope.organizationId);
					responseService.executeSuccess(data, null, null);
				});
			});
		};
	}

	AppSettingsController.$inject = ['$scope', '$state', '$modal', '$location', 'Restangular', 'responseService'];

	return AppSettingsController;
});