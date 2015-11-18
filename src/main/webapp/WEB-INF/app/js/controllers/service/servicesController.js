angular.module('controllers')
  .controller('servicesController',
    function ServicesController($scope, $state, menu, $mdDialog, Restangular) {

    $scope.org = menu.organization;
    $scope.orgId = $state.params.organizationId;
    $scope.loading = true;

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
      console.log($scope.instances.length);

    }, function(response) {
      responseService.error(response);
    });

    console.log($scope.instances);


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
          loadSpaces: $scope.loadSpaces,
          spaces: $scope.spaces,
          cancel: $scope.cancel,
          orgId: $scope.orgId
        },
        controller: ['$scope', 'plan', 'cancel', 'service', 'loadSpaces', 'spaces', 'orgId', function($scope, plan, cancel, service, loadSpaces, spaces, orgId) {
          $scope.plan = plan;
          $scope.cancel = cancel;
          $scope.service = service;
          $scope.loadSpaces = loadSpaces;
          $scope.spaces = spaces;
          $scope.orgId = orgId;

          // todo: no rest call needed for spaces

          $scope.test = function() {
            Restangular.one('organizations', $scope.orgId).all('spaces').getList().then(function(data) {
              $scope.spaces = data;
              console.log($scope.spaces.length);
            }, function(response) {
              responseService.error(response);
            });
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
          plan: plan,
          cancel: $scope.cancel
        },
        controller: ['$scope', 'plan', 'cancel', function($scope, plan, cancel) {
          $scope.plan = plan;
          $scope.cancel = cancel;
        }],
        templateUrl: 'partials/marketplace/service-plan-dialog-details.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true
      })
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.loading = false;
  });
