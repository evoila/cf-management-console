/**
 * OrganizationController
 **/


  angular.module('controllers')
  	.controller('organizationController',
  		function OrganizationController($scope, $state, $location, $mdDialog, Restangular, clientCacheService, responseService) {

		$scope.DEBUG = true;

		Restangular.one('organizations', $state.params.organizationId).get().then(function (data, status, headers) {
			$scope.organization = data;
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
				});
			});
		};

    $scope.deleteOrganization = function(ev) {
      var deleteDialog = {
        parent: angular.element(document.body),
        title: 'Delete',
        ariaLabel: 'Delete',
        template:
        '<md-dialog aria-label="List dialog">' +
        ' <md-dialog-content>' +
        '   <h3>Delete entity</h3>' +
        '   <p>Do you really want to delete the selected entity?</p>' +
        ' </md-dialog-content>' +
        ' <div class="md-actions">' +
        '   <md-button ng-click="cancel()" class="md-primary">Cancel</md-button>' +
        '   <md-button ng-click="ok()" class="md-primary">OK</md-button>' +
        ' </div>' +
        '</md-dialog>',
        controller: DeleteOrganizationController
      };
      $mdDialog.show(deleteDialog);
    };
});

function DeleteOrganizationController($scope, $state, $mdDialog, Restangular) {
  $scope.cancel = function() {
    $mdDialog.hide();
  };

  $scope.ok = function() {
    Restangular.one('organizations', $state.params.organizationId).remove().then(function(data, status, headers) {
      $location.path('/app-spaces/' + data[0].id);
      $mdDialog.hide();
      responseService.executeSuccess(data, null, null);
    });
  }
}
