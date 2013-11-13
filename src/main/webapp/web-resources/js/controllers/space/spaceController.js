/**
 * SpaceSettingsController
 **/

define(function () {
	'use strict';	
	
	function SpaceSettingsController($scope) {
		$scope.organizationId = $stateParams.organizationId;

		$scope.createSpace = function (spaceForm) {
			var spacesPromise = cloudfoundry.createSpace($scope.organizationId, spaceForm.name);
			spacesPromise.success(function (space, status, headers) {
				$location.path('/app-spaces/' + $scope.organizationId);
			});
			spacesPromise.error(function (data, status, headers) {
				$scope.error = 'Failed to create space. Reason: ' + data.code + ' - ' + data.description;
			});
		}
		
		var spacePromise = cloudfoundry.getSpace($stateParams.spaceId);
		spacePromise.success(function (data, status, headers) {
			$scope.space = data;
		});
		spacePromise.error(function (data, status, headers) {
			$scope.forceLogin(status);
			$scope.error = 'Failed to get space. Reason: ' + data.code + ' - ' + data.description;
		});

		$scope.deleteSpace = function () {
			var spacePromise = cloudfoundry.deleteSpace($scope.space.id);
			spacePromise.success(function (data, status, headers) {
				$location.path('/app-spaces/' + $stateParams.organizationId);
			});
			spacePromise.error(function (data, status, headers) {
				$scope.error = 'Failed to delete space. Reason: ' + data.code + ' - ' + data.description;
			});
		}
	}

	SpaceSettingsController.$inject = ['$scope'];

	return SpaceSettingsController;
});