/**
 * AppSpacesController
 **/

define(function () {
	'use strict';	
	
	function AppSpacesController($scope, $state, Restangular, responseService) {
		$scope.loading = true;
		$scope.organizationId = $state.params.organizationId;
		
		Restangular.one('organizations', $scope.organizationId).all('spaces').getList().then(function(data) {
			if (data[0] != undefined) {
				$scope.space = {selected: data[0].name};
				data[0].selected = true;    		
			}
			$scope.spaces = data;
			$scope.loading = false;
		}, function(data) {
			$scope.forceLogin(status);
			$scope.error = 'Failed to load spaces. Reason: ' + data.code + ' - ' + data.description;
			$scope.loading = false;
		});

		$scope.startApplication = function (applicationId) {
			Restangular.all('applications').customPUT(applicationId, null, null, {'state': 'STARTED'}).then(function(data) {
				responseService.executeSuccess(data, data.headers, null);
				angular.forEach($scope.spaces, function (space, spaceIndex) {
					if (space.selected) {
						var index = -1;
						angular.forEach(space.applications, function (app, appIndex) {
							if (app.id == applicationId) {
								index = appIndex;
							}
						});
						if (index > -1) {
							space.applications[index] = data;
						}
					}
				});
			}, function(data) {
				$scope.error = 'Failed to start application. Reason: ' + data.code + ' - ' + data.description;
			});
		};

		$scope.stopApplication = function (applicationId) {
			Restangular.all('applications').customPUT(applicationId, null, null, {'state': 'STOPPED'}).then(function(data) {
				responseService.executeSuccess(data, data.headers, null);
				angular.forEach($scope.spaces, function (space, spaceIndex) {
					if (space.selected) {
						var index = -1;
						angular.forEach(space.applications, function (app, appIndex) {
							if (app.id == applicationId) {
								index = appIndex;
							}
						});
						if (index > -1) {
							space.applications[index] = data;
						}
					}
				});
			}, function(data) {
				$scope.error = 'Failed to start application. Reason: ' + data.code + ' - ' + data.description;
			});
		};

		$scope.selectSpace = function (spaceName) {
			$scope.space.selected = spaceName;
		};
	}

	AppSpacesController.$inject = ['$scope', '$state', 'Restangular', 'responseService'];

	return AppSpacesController;
});