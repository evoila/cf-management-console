/**
 * AppSpacesController
 **/

angular.module('controllers')
  .controller('spacesController',
    function SpacesController($scope, $state, Restangular, responseService, menu, DesignService) {
      $scope.spaces = menu.spaces;

      Restangular.one('organizations', $state.params.organizationId).all('spaces').getList().then(function(spaces) {
        $scope.spaces = spaces;
      });

      $scope.colorString = function(name) {
        var myColor = DesignService.stringColor(name);
        return myColor;
      };

      $scope.servicePng = function(name) {
        var myService = DesignService.resolveServicePng(name);
        return myService;
      };

});
