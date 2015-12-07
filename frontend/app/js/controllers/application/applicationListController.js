/**
 * SpaceController
 **/

angular.module('controllers')
  .controller('applicationListController',
    function ApplicationListController($scope, $state, Restangular, DesignService) {

      $scope.init = function() {
        Restangular.one('spaces', $state.params.spaceId).get().then(function(data, status, headers) {
          $scope.s = data;
          getServiceBindingsDetails($scope.s);
        });
      };

      function getServiceBindingsDetails(space) {
        space.entity.apps.forEach(function(app) {
          app.bindingsDetails = [];
          app.entity.service_bindings.forEach(function(binding) {
            var instanceId = binding.entity.service_instance_guid;
            Restangular.one('service_instances/' + instanceId).get().then(function(instance) {
              var bindingDetail = {
                instance_guid: instance.metadata.guid,
                instance_name: instance.entity.name,
                guid: binding.metadata.guid
              };
              app.bindingsDetails.push(bindingDetail);
            });
          })
        })
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
