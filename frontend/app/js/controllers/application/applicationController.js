/**
 * AppSettingsController
 **/


angular.module('controllers')
  .controller('applicationController',
    function ApplicationController($scope, $state, $mdDialog, Restangular, DesignService, responseService) {
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

        Restangular.one('applications', application.metadata.guid).customPUT(application, null, null, null).then(function(data) {
          console.log("app started");
          responseService.success(data, 'application started');
        });
      };

      $scope.stopApplication = function(application) {
        application.entity.state = "STOPPED";

        Restangular.one('applications', application.metadata.guid).customPUT(application, null, null, null).then(function(data) {
          console.log("app stopped");
          responseService.success(data, 'application stopped');
        });
      };

      $scope.scaleApplication = function(application, instacesCount) {
        application.entity.instances = instancesCount;

        Restangular.one('applications', application.metadata.guid).customPUT(application, null, null, null).then(function(data) {
          console.log("app scaled");
          responseService.success(data, 'application scaled');
        });
      }

      $scope.deleteApplication = function(ev, application) {
         var confirm = $mdDialog.confirm()
               .title('Really delete this application?')
               .textContent(application.entity.name)
               .ariaLabel('Confirm delete')
               .targetEvent(ev)
               .ok('Yes')
               .cancel('Better not');
         $mdDialog.show(confirm).then(function() {
           Restangular.one('applications', application.metadata.guid).remove().then(function(data) {
             console.log("app deleted");
             responseService.success(data, 'application deleted', 'space', $state.params);
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
