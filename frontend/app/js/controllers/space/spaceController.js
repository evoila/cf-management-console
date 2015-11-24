/**
 * SpaceController
 **/

angular.module('controllers')
  .controller('spaceController',
    function SpaceController($scope, $state, Restangular, DesignService) {

      $scope.init = function() {
        Restangular.one('spaces', $state.params.spaceId).get().then(function(data, status, headers) {
          $scope.s = data;
          console.log("space init tatds");
          console.log($scope.s);
        });
      };

      $scope.colorString = function(name) {
        var myColor = DesignService.stringColor(name);
        return myColor;
      };

      $scope.servicePng = function(name) {
        var myService = DesignService.resolveServicePng(name);
        return myService;
      };
    });
