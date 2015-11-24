angular.module('controllers')
  .controller('serviceInstanceController',
    function ServiceInstanceController($scope, $state, menu, $mdDialog, Restangular, DesignService) {

      $scope.space = $state.params.space;

      if(!$scope.space) {
        Restangular.one('spaces', $state.params.spaceId).get().then(function(space) {
          $scope.space = space;
          $scope.instances = space.entity.service_instances;
        })
      }
      else
        $scope.instances = $scope.space.entity.service_instances;



      $scope.colorString = function(name) {
        var myColor = DesignService.stringColor(name);
        return myColor;
      };

      $scope.servicePng = function(name) {
        var myService = DesignService.resolveServicePng(name);
        return myService;
      };
    });
