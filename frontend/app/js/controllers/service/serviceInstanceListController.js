angular.module('controllers')
  .controller('serviceInstanceListController',
    function ServiceInstanceListController($scope, $state, menu, $mdDialog, Restangular, DesignService, responseService) {

      $scope.space = $state.params.space;
      $scope.orgId = $state.params.organizationId;

      $scope.init = function() {
        Restangular.one('spaces', $state.params.spaceId).get().then(function(space) {
          $scope.space = space;
          $scope.instances = space.entity.service_instances;
          getServiceBindingsDetails($scope.instances);
          getNameOfInstancesService($scope.instances);
        })
      };

      function getNameOfInstancesService(instances) {
        instances.forEach(function(instance) {
          var serviceId = instance.entity.service_plan.entity.service_guid;
          Restangular.one('services', serviceId).get().then(function(service) {
            instance.serviceName = service.entity.label;
          })
        });
      }

      function getServiceBindingsDetails(instances) {
        instances.forEach(function(instance) {
          instance.bindingsDetails = [];
          instance.entity.service_bindings.forEach(function(binding) {
            var appId = binding.entity.app_guid;
            Restangular.one('applications', appId).get().then(function(app) {
              var bindingDetail = {
                app_guid: app.metadata.guid,
                app_name: app.entity.name,
                app_state: app.entity.state,
                guid: binding.metadata.guid
              };
              instance.bindingsDetails.push(bindingDetail);
            });
          })
        })
      }


      /*
       *  Dialog for
       *
       *  Confirm delete service binding
       *
       */
      $scope.deleteServiceBinding = function(ev, instance, binding) {
        var confirm = $mdDialog.confirm()
              .title('Really delete binding?')
              .textContent(instance.entity.name + ' with ' + binding.app_name)
              .ariaLabel('Confirm delete')
              .targetEvent(ev)
              .ok('Yes')
              .cancel('Better not');
        $mdDialog.show(confirm).then(function() {
          deleteServiceBinding(binding.guid);
        });
      };

      function deleteServiceBinding(service_binding_guid) {
        Restangular.one('service_bindings', service_binding_guid).remove().then(function() {
          $mdDialog.hide();
          responseService.success(null, 'Binding was deleted successfully', 'service-list', { organizationId : $scope.orgId, spaceId : $scope.space.metadata.guid });
        }, function(response) {
          responseService.error(response);
        });
      }


      /*
       *  Dialog for
       *
       *  Confirm delete instance
       *
       */
       $scope.showConfirm = function(ev, instance) {
        var confirm = $mdDialog.confirm()
              .title('Really delete instance?')
              .textContent(instance.entity.name)
              .ariaLabel('Confirm delete')
              .targetEvent(ev)
              .ok('Yes')
              .cancel('Better not');
        $mdDialog.show(confirm).then(function() {
          deleteServiceInstance(instance);
        });
      };

      function deleteServiceInstance(instance) {
        Restangular.one('service_instances', instance.metadata.guid).remove().then(function() {
          $mdDialog.hide();
          responseService.success(instance, 'Instance was deleted successfully', 'service-list', { organizationId : $scope.orgId, spaceId : $scope.space.metadata.guid });
        }, function(response) {
            console.log(response)
            if(response.status == '409')
              responseService.error(response, 'Another operation for that service instance is in progress');
            else
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
