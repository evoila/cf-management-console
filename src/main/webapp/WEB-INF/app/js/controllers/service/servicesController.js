angular.module('controllers')
  .controller('servicesController',
    function ServicesController($scope, $state, menu, $mdDialog, Restangular, DesignService) {

    $scope.orgId = $state.params.organizationId;

    Restangular.one('organizations', $state.params.organizationId).get().then(function(org) {
      $scope.org = org;
      $scope.spaces = $scope.org.entity.spaces;
    });

    var self = this;
    self.showCreate = false;
    self.service = $state.params.service;

    if(!self.service) {
      Restangular.one('services', $state.params.serviceId).get().then(function(service) {
        self.service = service;
      })
    }
    else
      self.service = $state.params.service;


    $scope.instances = [];

    Restangular.one('service_instances', $scope.orgId).getList().then(function(instances) {
      instances.forEach(function(instance) {
        self.service.entity.service_plans.forEach(function(plan) {
          if(plan.metadata.guid == instance.entity.service_plan_guid) {
            instance.planUniqueId = plan.entity.unique_id;
            $scope.instances.push(instance);
          }
        })
      })
    }, function(response) {
      responseService.error(response);
    });


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
        },
        controller: ['$scope', 'plan', 'service', function($scope, plan, service) {
          $scope.plan = plan;
          $scope.service = service;
          $scope.noOption = false;

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
        clickOutsideToClose: true
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
