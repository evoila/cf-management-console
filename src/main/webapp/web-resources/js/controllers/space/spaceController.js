/**
 * SpaceController
 **/

define(function () {
	'use strict';	
	
	function SpaceController($scope, $state, $location, Restangular, clientCacheService) {
		$scope.organizationId = $state.params.organizationId;

		$scope.createSpace = function (spaceForm) {
			var user = clientCacheService.getUser();
			var spaceContent = {'organization_guid': $scope.organizationId, 'name': spaceForm.name, 'manager_guids': [user.id], 'developer_guids': [user.id]};
			Restangular.all('spaces').post(spaceContent).then(function(space) {
				$location.path('/app-spaces/' + organization.organizationId);
				responseService.executeSuccess(space, null, null);
			}, function(data, status, header) {
				$scope.error = 'Failed to create organization. Reason: ' + data.code + ' - ' + data.description;
				responseService.executeError(data, status, headers, $scope, 'organization');
			});
		}
		
		$scope.init = function() {
			Restangular.one('spaces', $state.params.spaceId).get().then(function (data, status, headers) {
				$scope.space = data;
			}, function (data, status, headers) {
				$scope.forceLogin(status);
				$scope.error = 'Failed to get space. Reason: ' + data.code + ' - ' + data.description;
			});
		};

		$scope.deleteSpace = function () {
			var modalInstance = $modal.open({
				templateUrl : 'partials/general/delete.html',
				controller: 'deleteController'
			});

			modalInstance.result.then(function (response) {

				Restangular.one('spaces', $scope.space.id).remove().then(function (data, status, headers) {							
						$location.path('/app-spaces/' + $stateParams.organizationId);
						responseService.executeSuccess(data, null, null);
					},function (data, status, headers) {
						$scope.error = 'Failed to load organization. Reason: ' + data.code + ' - ' + data.description;
						responseService.executeError(data, status, headers, $scope, 'organization');
				});
			});			
		}
	}

	SpaceController.$inject = ['$scope', '$state', '$location', 'Restangular', 'clientCacheService'];

	return SpaceController;
});