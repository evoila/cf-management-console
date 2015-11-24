angular.module('controllers')
  .controller('servicesController',
    function ServicesController($scope, $state, menu, $mdDialog, Restangular, DesignService) {

    var self = this;
    self.service = $state.params.service;

    $scope.init = function() {

      self.showCreate = false;
      $scope.orgId = $state.params.organizationId;
      $scope.instances = [];

      Restangular.one('organizations', $state.params.organizationId).get().then(function(org) {
        $scope.org = org;
        $scope.spaces = $scope.org.entity.spaces;
      });

      if(!self.service) {
        Restangular.one('services', $state.params.serviceId).get().then(function(service) {
          self.service = service;
        })
      }
      else
        self.service = $state.params.service;

      Restangular.one('service_instances', $scope.orgId).getList().then(function(instances) {
        var colors = DesignService.getNumberOfVisuallyDistinctColors(self.service.entity.service_plans.length);

        instances.forEach(function(instance, instanceIndex) {
          self.service.entity.service_plans.forEach(function(plan, planIndex) {
            plan.color = colors[planIndex];
            if(plan.metadata.guid == instance.entity.service_plan_guid) {
              instance.planUniqueId = plan.entity.unique_id;
              instance.color = plan.color;
              $scope.instances.push(instance);
            }
          })
        })
      }, function(response) {
        responseService.error(response);
      });
    }

    /*
     *  Dialog for
     *
     *  Show Service Plan Details / Create
     *
     */
    $scope.showServicePlanDetails = function(plan) {
      $mdDialog.show({
        locals: {
          plan: plan,
          service: self.service,
          spaces: $scope.spaces
        },
        controller: ['$scope', 'plan', 'service', 'spaces', function($scope, plan, service, spaces) {
          $scope.plan = plan;
          $scope.service = service;
          $scope.noOption = false;
          $scope.spaces = spaces;

          $scope.cancel = function() {
            $mdDialog.cancel();
          };

          $scope.submitCreateServiceInstanceForm = function(form) {
            if(!form.spaceId) {
              $scope.noOption = true;
            }
            else {
              var instance = {
                'space_guid': form.spaceId,
                'name': form.instanceName,
                'service_plan_guid': $scope.plan.metadata.guid
              };

              // rest: Create Service Instance
              Restangular.all('service_instances').post(instance).then(function(response) {
                $mdDialog.hide();
                $state.go('service', {organizationId : $scope.orgId, spaceId : form.spaceId});
              }, function(response) {
                responseService.error(response);
              })
            }
          };

        }],
        templateUrl: 'partials/marketplace/service-plan-dialog-details.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false
      })
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
