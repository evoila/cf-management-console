/**
 * OrganisationSettingsController
 **/

define(function () {
	'use strict';	
	
	function OrganisationSettingsController($scope) {
		
		$scope.createOrganization = function (organizationForm) {
        var organizationPromise = cloudfoundry.createOrganization(organizationForm);
        organizationPromise.success(function (organization, status, headers) {
            var spacesPromise = cloudfoundry.createSpace(organization.metadata.guid, 'development');
            spacesPromise.success(function (space, status, headers) {
                $location.path('/app-spaces/' + organization.metadata.guid);
            });
            spacesPromise.error(function (data, status, headers) {
                $scope.error = 'Failed to create organization. Reason: ' + data.code + ' - ' + data.description;
            });
        });
        organizationPromise.error(function (data, status, headers) {
            $scope.error = 'Failed to create organization. Reason: ' + data.code + ' - ' + data.description;
        });
    }

		var organizationPromise = cloudfoundry.getOrganization($stateParams.organizationId);
		organizationPromise.success(function (data, status, headers) {
			$scope.organization = data;
		});
		organizationPromise.error(function (data, status, headers) {
			$scope.forceLogin(status);
			$scope.error = 'Failed to load organizations. Reason: ' + data.code + ' - ' + data.description;
		});

		$scope.deleteOrganization = function () {
			$scope.loading = true;

			var organizationDeletePromise = cloudfoundry.deleteOrganization($scope.organization.id);
			organizationDeletePromise.success(function (data, status, headers) {
				var organizationsPromise = cloudfoundry.getOrganizations();
				organizationsPromise.success(function (data, status, headers) {
					$location.path('/app-spaces/' + data[0].id);
				});
				organizationsPromise.error(function (data, status, headers) {
					$scope.error = 'Failed to load organization. Reason: ' + data.code + ' - ' + data.description;
				});
			});
			organizationDeletePromise.error(function (data, status, headers) {
				$scope.error = 'Failed to delete organization. Reason: ' + data.code + ' - ' + data.description;
			});
		}
	}

	OrganisationSettingsController.$inject = ['$scope'];

	return OrganisationSettingsController;
});