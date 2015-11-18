angular.module('controllers')
  .controller('servicesController',
    function ServicesController($scope, $state, menu, $mdDialog, Restangular) {

    $scope.org = menu.organization;
    $scope.orgId = $state.params.organizationId;
    $scope.loading = true;

    var self = this;
    self.service = $state.params.service;

    $scope.spaces = null;
    $scope.btClass = 'bt-inactive'

    $scope.init = function() {
      Restangular.one('spaces', $state.params.spaceId).all('summary').getList().then(function(data) {
        $scope.space = data;
      }, function(response) {

      });
    };

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

          $scope.test = function() {
            Restangular.one('organizations', $scope.orgId).all('spaces').getList().then(function(data) {
              $scope.spaces = data;
              console.log($scope.spaces.length);
            }, function(response) {

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
              console.log(response);
            })

          }

        }],
        templateUrl: 'partials/service/serviceInstance-create-dialog.html',
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
        templateUrl: 'partials/service/servicePlan-details-dialog.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true
      })
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.createServiceInstanceFromPlan = function(plan) {
      console.log(plan.entity.name);
    };

    $scope.loading = false;
  });
