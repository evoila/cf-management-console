/**
 * AppSettingsController
 **/


angular.module('controllers')
  .controller('applicationController',
    function ApplicationController($scope, $state, Restangular, DesignService) {
      $scope.loading = true;
      $scope.organizationId = $state.params.organizationId;
      console.log("ApplicationController");

      Restangular.one('applications', $state.params.applicationId).all('instances').getList().then(function(instances) {
        console.log("applicationInstances: ", instances );
        $scope.instances = instances;
      });

      Restangular.one('applications', $state.params.applicationId).get().then(function(application) {
        $scope.application = application;
        $scope.loading = false;
        angular.forEach(application.entity.service_bindings, function(binding) {
            Restangular.one('applications', $state.params.applicationId).one('bindings', binding.entity.service_instance_guid).get().then(function(serviceBinding) {
              console.log("Service Binding - write to var: "+serviceBinding);
            });
        });
      });

      $scope.startApplication = function(applicationId) {
        Restangular.all('applications').customPUT(applicationId, null, null, {
          'state': 'STARTED'
        }).then(function(data) {
          //TODO: Needs to be change
          responseService.success(data, 'route');
          angular.forEach($scope.spaces, function(space, spaceIndex) {
            if (space.selected) {
              var index = -1;
              angular.forEach(space.applications, function(app, appIndex) {
                if (app.id == applicationId) {
                  index = appIndex;
                }
              });
              if (index > -1) {
                space.applications[index] = data;
              }
            }
          });
        });
      };

      $scope.stopApplication = function(applicationId) {
        Restangular.all('applications').customPUT(applicationId, null, null, {
          'state': 'STOPPED'
        }).then(function(data) {
          //TODO: Needs to be change
          responseService.success(data, 'route');
          angular.forEach($scope.spaces, function(space, spaceIndex) {
            if (space.selected) {
              var index = -1;
              angular.forEach(space.applications, function(app, appIndex) {
                if (app.id == applicationId) {
                  index = appIndex;
                }
              });
              if (index > -1) {
                space.applications[index] = data;
              }
            }
          });
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
