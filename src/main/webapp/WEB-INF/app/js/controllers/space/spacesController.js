/**
 * AppSpacesController
 **/

angular.module('controllers')
  .controller('spacesController',
    function SpacesController($scope, $state, $location, $mdDialog, Restangular, responseService, menu, DesignService) {
      console.log('SpacesController');

      $scope.state = $state;
      $scope.loading = true;
      $scope.organizationId = $state.params.organizationId;
      $scope.appSpace = null;
      $scope.isOpen = false;
      $scope.demo = {
        isOpen: false,
        count: 0,
        selectedAlignment: 'md-left'
      };

      Restangular.one('organizations', $scope.organizationId).all('spaces').getList().then(function(data) {
        if (data[0] != undefined) {
          $scope.space = {
            selected: data[0].entity.name
          };
          $scope.appSpace = data[0].entity;
          data[0].entity.selected = true;
        }
        menu.spacesToMenu($scope.organizationId, data);
        $scope.spaces = data;
        $scope.loading = false;



        angular.forEach($scope.spaces, function(space) {
          space.count = 0;
          angular.forEach(space.entity.apps, function(app) {
            if (app.entity.state == "STARTED") {
              space.count++;
            }
          });
        });
      });

      $scope.colorString = function(name) {
        var myColor = DesignService.stringColor(name);
        return myColor;
      };

      $scope.servicePng = function(name) {
        var myService = DesignService.resolveServicePng(name);
        return myService;
      };

      $scope.selectSpace = function(spaceName) {
        $scope.space.selected = spaceName;
      };

      $scope.goToAppSettings = function(app) {
        $state.go('app-settings', {
          organizationId: $scope.appSpace.organization_guid,
          applicationId: app.metadata.guid
        });
      }
});
