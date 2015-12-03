/**
 * MarketPlaceController
 **/
angular.module('controllers')
  .controller('marketplaceController',
    function MarketplaceController($scope, $state, menu, Restangular, DesignService, $mdDialog, responseService) {
      $scope.org = menu.organization;
      $scope.orgId = $state.params.organizationId;

      $scope.editMode = false;

      Restangular.all('services').getList().then(function(services) {
        $scope.services = services;
      });

      /*
       *  Dialog for
       *
       *  Confirm delete service
       *
       */
       $scope.showConfirm = function(ev, service) {
        var confirm = $mdDialog.confirm()
              .title('Really delete service?')
              .textContent(service.entity.label)
              .ariaLabel('Confirm delete')
              .targetEvent(ev)
              .ok('Yes')
              .cancel('Better not');
        $mdDialog.show(confirm).then(function() {
          deleteService(service);
        });
      };

      function deleteService(service) {
        Restangular.one('services', service.metadata.guid).remove().then(function() {
          responseService.success(service, 'Service was deleted successfully', 'marketplace', { organizationId : $scope.orgId });
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
