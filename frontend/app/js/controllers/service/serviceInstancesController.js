angular.module('controllers')
  .controller('serviceInstanceController',
    function ServiceInstanceController($scope, $state, menu, $mdDialog, Restangular, DesignService, responseService) {

      $scope.space = $state.params.space;
      $scope.orgId = $state.params.organizationId;

      $scope.init = function() {
        Restangular.one('spaces', $state.params.spaceId).get().then(function(space) {
          $scope.space = space;
          $scope.instances = space.entity.service_instances;
        })
      };

      /*
       *  Dialog for
       *
       *  Confirm delete instance
       *
       */
       $scope.showConfirm = function(ev, instance) {
        var confirm = $mdDialog.confirm()
              .title('Really delete instance?')
              .textContent(instance.entity.name)
              .ariaLabel('Confirm delete')
              .targetEvent(ev)
              .ok('Yes')
              .cancel('Better not');
        $mdDialog.show(confirm).then(function() {
          deleteServiceInstance(instance);
        });
      };

      function deleteServiceInstance(instance) {
        Restangular.one('service_instances', instance.metadata.guid).remove().then(function() {
          $mdDialog.hide();
          responseService.success(instance, 'Instance was deleted successfully', 'service', { organizationId : $scope.orgId, spaceId : $scope.space.metadata.guid });
        }, function(response) {
          responseService.error(response);
        });
      }

      $scope.colorString = function(name) {
        var myColor = DesignService.stringColor(name);
        return myColor;
      };

      $scope.servicePng = function(name) {
        var myService = DesignService.resolveServicePng(name);
        return myService;
      };

    });
