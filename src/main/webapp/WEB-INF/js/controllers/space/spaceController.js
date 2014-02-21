/**
 * SpaceController
 **/

define(function () {
	'use strict';	
	
	function SpaceController($scope, $state, $modal, $location,  Restangular, clientCacheService, responseService) {
		$scope.organizationId = $state.params.organizationId;

		$scope.createSpace = function (spaceForm) {
			var user = clientCacheService.getUser();
			var spaceContent = {'organization_guid': $scope.organizationId, 'name': spaceForm.name};
			Restangular.all('spaces').post(spaceContent).then(function(space) {
				$location.path('/app-spaces/' + $scope.organizationId);
				responseService.executeSuccess(space, null, null);
			});
		};
		
		$scope.init = function() {
			Restangular.one('spaces', $state.params.spaceId).get().then(function (data, status, headers) {
				$scope.space = data;
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
				});
			});			
		};
	}

	SpaceController.$inject = ['$scope', '$state', '$modal', '$location', 'Restangular', 'clientCacheService', 'responseService'];

	return SpaceController;
});