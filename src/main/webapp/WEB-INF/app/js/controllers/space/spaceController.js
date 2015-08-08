/**
 * SpaceController
 **/

angular.module('controllers')
  .controller('spaceController',
    function SpaceController($scope, $state, $mdDialog, $location, Restangular, clientCacheService, responseService) {

      $scope.organizationId = $state.params.organizationId;

      $scope.createSpace = function(spaceForm) {
        console.log(spaceForm)
        var user = clientCacheService.getUser();
        var spaceContent = {
          'organization_guid': $scope.organizationId,
          'name': spaceForm.name,
          'manager_guids': [user.id],
          'developer_guids': [user.id]
        };
        Restangular.all('spaces').post(spaceContent).then(function(space) {
          $location.path('/app-spaces/' + $scope.organizationId);
          responseService.executeSuccess(space, null, null);
        });
      };

      $scope.init = function() {
        Restangular.one('spaces', $state.params.spaceId).get().then(function(data, status, headers) {
          $scope.space = data;
        });
      };

      $scope.deleteSpace = function(ev) {
        var deleteDialog = {
          parent: angular.element(document.body),
          title: 'Delete',
          ariaLabel: 'Delete',
          template: '<md-dialog aria-label="List dialog">' +
            '<md-dialog-content>' +
            '<h3>Delete entity</h3>' +
            '<p>Do you really want to delete the selected entity?</p>' +
            '</md-dialog-content>' +
            '<div class="md-actions">' +
            '<md-button ng-click="cancel()" class="md-primary">Cancel</md-button>' +
            '<md-button ng-click="ok()" class="md-primary">OK</md-button>' +
            '</div>' +
            '</md-dialog>',
          controller: DeleteSpaceController
        };
        $mdDialog.show(deleteDialog);
      };
    });

function DeleteSpaceController($scope, $state, $location, $mdDialog, Restangular, responseService) {
  $scope.cancel = function() {
    $mdDialog.hide();
  };

  $scope.ok = function() {
    Restangular.one('spaces', $state.params.spaceId).remove().then(function(data, status, headers) {
      $location.path('/app-spaces/' + $state.params.organizationId);
      $mdDialog.hide();
      responseService.executeSuccess(data, null, null);
    });
  }
}
