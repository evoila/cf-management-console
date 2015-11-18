angular.module('controllers')
  .controller('servicesController',
    function ServicesController($scope, $state, menu, $mdDialog, Restangular) {

    $scope.org = menu.organization;
    $scope.orgId = $state.params.organizationId;

    var self = this;
    self.service = $state.params.service;

    $scope.spaces = $scope.org.entity.spaces;
    $scope.instances = [];


    Restangular.one('service_instances', $scope.orgId).getList().then(function(instances) {
      instances.forEach(function(instance) {
        self.service.entity.service_plans.forEach(function(plan) {
          if(plan.metadata.guid == instance.entity.service_plan_guid)
            $scope.instances.push(instance);
        })
      })
    }, function(response) {
      responseService.error(response);
    });


    /*
     *  Dialog for
     *
     *  Create Service Instance
     *
     */
    $scope.showCreateInstanceDialog = function(plan) {

      $mdDialog.show({
        locals: {
          plan: plan,
          service: self.service,
          org: $scope.org
        },
        controller: ['$scope', 'plan', 'service', 'org', function($scope, plan, service, org) {
          $scope.plan = plan;
          $scope.service = service;
          $scope.org = org;
          $scope.spaces = [];

          // todo: no rest call needed for spaces

          $scope.getSpaces = function() {
            $scope.spaces = $scope.org.entity.spaces;
          }

          $scope.submitCreateServiceInstanceForm = function(form) {
            var instance = {
              'space_guid': form.spaceId,
              'name': form.instanceName,
              'service_plan_guid': $scope.plan.metadata.guid
            };

            // rest: Create Service Instance
            Restangular.all('service_instances').post(instance).then(function(response) {
              console.log(response);
            }, function(response) {
              responseService.error(response);
            })

          }

          $scope.cancel = function() {
            $mdDialog.cancel();
          };

        }],
        templateUrl: 'partials/service/service-instance-dialog-create.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false
      })
    };


    /*
     *  Dialog for
     *
     *  Show Service Plan Details
     *
     */
    $scope.showServicePlanDetails = function(plan) {
      $mdDialog.show({
        locals: {
          plan: plan
        },
        controller: ['$scope', 'plan', function($scope, plan) {
          $scope.plan = plan;
          $scope.cancel = function() {
            $mdDialog.cancel();
          };
        }],
        templateUrl: 'partials/marketplace/service-plan-dialog-details.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true
      })
    };




  });
