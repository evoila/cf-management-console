/**
 * AppSpacesController
 **/

angular.module('controllers')
  .controller('spacesController',
    function SpacesController($scope, $state, $location, $mdDialog, Restangular, responseService, menu, DesignService) {
      console.log('SpacesController');
      $scope.organizationId = $state.params.organizationId;

      $scope.colorString = function(name) {
        var myColor = DesignService.stringColor(name);
        return myColor;
      };

      $scope.servicePng = function(name) {
        var myService = DesignService.resolveServicePng(name);
        return myService;
      };

});
