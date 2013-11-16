/**
 * OrganisationController
 **/

define(function () {
	'use strict';	
	
	function OrganisationController($scope, $state, $location, $modal, Restangular, clientCacheService, responseService) {
		$scope.DEBUG = true;

		Restangular.one('organizations', $state.params.organizationId).getList().then(function (data, status, headers) {
			$scope.organization = data;
		}, function (data, status, headers) {
			$scope.forceLogin(status);
			$scope.error = 'Failed to load organizations. Reason: ' + data.code + ' - ' + data.description;
		});

		$scope.createOrganization = function(organizationForm) {
			if ($scope.DEBUG)
				console.log("createOrganization was clicked");
			
			var user = clientCacheService.getUser();
			var orgnisationContent = {'name': organizationForm.name, 'user_guids': [user.id], 'manager_guids': [user.id]};
			Restangular.all('organizations').post(orgnisationContent).then(function(organization) {

				var spaceContent = {'organization_guid': organization.metadata.guid, 'name': 'development', 'manager_guids': [user.id], 'developer_guids': [user.id]};
				Restangular.all('spaces').post(spaceContent).then(function(space) {
					
					$location.path('/app-spaces/' + organization.metadata.guid);
					responseService.executeSuccess(space, null, null);
				}, function(data, status, header) {
					$scope.error = 'Failed to create organization. Reason: ' + data.code + ' - ' + data.description;
					responseService.executeError(data, status, headers, $scope, 'organization');
				});
			}, function(data, status, header) {
				$scope.error = 'Failed to create organization. Reason: ' + data.code + ' - ' + data.description;
				responseService.executeError(data, status, headers, $scope, 'organization');
			});
		};

		$scope.deleteOrganization = function() {
			if ($scope.DEBUG)
				console.log("deleteOrganization was clicked");

			var modalInstance = $modal.open({
				templateUrl : 'partials/general/delete.html',
				controller: 'deleteController'
			});

			modalInstance.result.then(function (response) {
				$scope.loading = true;
				Restangular.one('organizations', $scope.organization.id).remove().then(function (data, status, headers) {							
						$location.path('/app-spaces/' + data[0].id);
						responseService.executeSuccess(data, null, null);
					},function (data, status, headers) {
						$scope.error = 'Failed to load organization. Reason: ' + data.code + ' - ' + data.description;
						responseService.executeError(data, status, headers, $scope, 'organization');
				});
			});
		};
	}

	OrganisationController.$inject = ['$scope', '$state', '$location', '$modal', 'Restangular', 'clientCacheService', 'responseService'];

	return OrganisationController;
});