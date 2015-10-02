/**
 * AppSettingsController
 **/


angular.module('controllers')
  .controller('appSettingsController',
    function AppSettingsController($scope, $state, $mdDialog, $location, Restangular, responseService) {

      $scope.loading = true;
      $scope.organizationId = $state.params.organizationId;

      Restangular.one('applications', $state.params.applicationId).get().then(function(application) {
        $scope.application = application;
        $scope.loading = false;
      });

      Restangular.one('applications', $state.params.applicationId).all('instances').getList().then(function(instances) {
        $scope.instances = instances;
      });

      $scope.deleteApplication = function(ev, application) {
        $scope.application = application;
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
          controller: DeleteApplicationController
        };
        $mdDialog.show(deleteDialog);
      };
    });

function DeleteApplicationController($scope, $state, $mdDialog, Restangular) {
  $scope.cancel = function() {
    $mdDialog.hide();
  };

  $scope.ok = function() {
    console.log($scope.application)
    Restangular.one('applications', $scope.applicationId).remove().then(function(data, status, headers) {
      $location.path('/spaces/' + $scope.organizationId);
      $mdDialog.hide();
      responseService.executeSuccess(data, null, null);
    });
  }
}
