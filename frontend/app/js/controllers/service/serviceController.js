angular.module('controllers')
  .controller('serviceController',
    function ServiceController($scope, $state, menu, $mdDialog, Restangular, DesignService, responseService) {

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
          getInstances();
        })
      }
      else {
        self.service = $state.params.service;
        getInstances();
      }
    }

    function getInstances() {
      Restangular.one('service_instances/org/' + $scope.orgId).getList().then(function(instances) {
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
        console.log($scope.instances)
      }, function(response) {
        console.log(response)
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
          $scope.tags = [];

          $scope.cancel = function() {
            $mdDialog.cancel();
          };

          $scope.submitCreateServiceInstanceForm = function(form) {
            if(!form.spaceId)
              $scope.noOption = true;

            else {
              var instance = {
                'space_guid': form.spaceId,
                'name': form.instanceName,
                'service_plan_guid': $scope.plan.metadata.guid,
                'tags': $scope.tags
              };

              Restangular.all('service_instances').post(instance).then(function(instance) {
                $mdDialog.hide();
                responseService.success(instance, 'Creating new Service Instance...', 'service-list', { organizationId : $state.params.organizationId, spaceId : form.spaceId });
              }, function(response) {
                if(response.status == '400' && response.data.message.indexOf('is taken') > -1)
                  $scope.nameInUse = true;
                else if(response.status == '500' && response.data.message.indexOf('502') > -1)
                  responseService.error(response, 'Error. Please make sure that Application is running.');
                else
                  responseService.error(response);
              })
            }
          };

        }],
        templateUrl: 'partials/marketplace/marketplace-service-plan-dialog-details.html',
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
