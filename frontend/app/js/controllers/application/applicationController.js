/**
 * AppSettingsController
 **/


angular.module('controllers')
  .controller('applicationController',
    function ApplicationController($scope, $state, Restangular, DesignService, responseService) {
      $scope.loading = true;
      $scope.organizationId = $state.params.organizationId;
      console.log("ApplicationController");

      Restangular.one('applications', $state.params.applicationId).all('instances').getList().then(function(instances) {
        console.log("applicationInstances: ", instances);
        $scope.instances = instances;
      });

      Restangular.one('applications', $state.params.applicationId).get().then(function(application) {
        $scope.application = application;
        $scope.loading = false;
        angular.forEach(application.entity.service_bindings, function(binding) {
          Restangular.one('applications', $state.params.applicationId).one('bindings', binding.entity.service_instance_guid).get().then(function(serviceBinding) {
            console.log("Service Binding - write to var: " + serviceBinding);
          });
        });
      });

      $scope.startApplication = function(application) {
        application.entity.state = "STARTED";
        /*delete myApplication.entity.staging_failed_reason;
        delete myApplication.entity.staging_failed_description;
        delete myApplication.entity.diego;
        delete myApplication.entity.docker_image;
        delete myApplication.entity.package_updated_at;
        delete myApplication.entity.detected_start_command;
        delete myApplication.entity.enable_ssh;
        delete myApplication.entity.docker_credentials_json;
        delete myApplication.entity.space_url;
        delete myApplication.entity.space;
        delete myApplication.entity.stack_url;
        delete myApplication.entity.stack;
        delete myApplication.entity.events_url;
        delete myApplication.entity.service_bindings_url;
        delete myApplication.entity.service_bindings;
        delete myApplication.entity.routes_url;
        delete myApplication.entity.routes;*/
        Restangular.one('applications', application.metadata.guid).customPUT(application, null, null, null).then(function(data) {
          console.log("app started");
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

      $scope.stopApplication = function(application) {
        application.entity.state = "STOPPED";
        /*delete myApplication.entity.staging_failed_reason;
        delete myApplication.entity.staging_failed_description;
        delete myApplication.entity.diego;
        delete myApplication.entity.docker_image;
        delete myApplication.entity.package_updated_at;
        delete myApplication.entity.detected_start_command;
        delete myApplication.entity.enable_ssh;
        delete myApplication.entity.docker_credentials_json;
        delete myApplication.entity.space_url;
        delete myApplication.entity.space;
        delete myApplication.entity.stack_url;
        delete myApplication.entity.stack;
        delete myApplication.entity.events_url;
        delete myApplication.entity.service_bindings_url;
        delete myApplication.entity.service_bindings;
        delete myApplication.entity.routes_url;
        delete myApplication.entity.routes;*/

        Restangular.one('applications', application.metadata.guid).customPUT(application, null, null, null).then(function(data) {
          console.log("app stopped");
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
