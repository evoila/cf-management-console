/**
 * AppSpacesController
 **/

angular.module('controllers')
  .controller('spaceListController',
    function SpaceListController($scope, $state, $mdDialog, $rootScope, $document, Restangular, responseService, menu, DesignService) {
      $scope.spaces = menu.spaces;
      $scope.orgId = $state.params.organizationId;

      $scope.init = function() {
        Restangular.one('organizations', $state.params.organizationId).all('spaces').getList().then(function(spaces) {
          $scope.spaces = spaces;
        });
      };

      $scope.openMenu = function($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
      };

      $scope.colorString = function(name) {
        var myColor = DesignService.stringColor(name);
        return myColor;
      };

      $scope.servicePng = function(name) {
        var myService = DesignService.resolveServicePng(name);
        return myService;
      };

      $scope.checkIfApps = function(space) {
        if(space.entity.apps.length > 0)
          $state.go('application-list', { organizationId : space.entity.organization.metadata.guid, spaceId : space.metadata.guid })
      }

      $scope.checkIfInstances = function(space) {
        if(space.entity.service_instances.length > 0)
          $state.go('service-list', { organizationId : space.entity.organization.metadata.guid, spaceId : space.metadata.guid, space: space })
      }

      /*
       *  Dialog for
       *
       *  Confirm delete space
       *
       */
       $scope.showConfirm = function(ev, space) {
        var confirm = $mdDialog.confirm()
              .title('Really delete space?')
              .textContent(space.entity.name)
              .ariaLabel('Confirm delete')
              .targetEvent(ev)
              .ok('Yes')
              .cancel('Better not');
        $mdDialog.show(confirm).then(function() {
          deleteSpace(space);
        });
      };

      function deleteSpace(space) {
        Restangular.one('spaces', space.metadata.guid).remove().then(function() {
          $mdDialog.hide();
          responseService.success(space, 'Space was deleted successfully', 'space-list', { organizationId : $scope.orgId });
        }, function(response) {
          responseService.error(response);
        });
      }

      /*
       *  Dialog for
       *
       *  Create new space
       *
       */
      $scope.showCreateSpaceDialog = function(ev) {
        $mdDialog.show({
          controller: SpaceListController,
          templateUrl: 'partials/space/space-create-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false
        })
      };

      $scope.submitCreateSpaceForm = function(form) {
        var space = {
          name: form.name,
          organization_guid: $scope.orgId,
          allow_ssh: form.allow_ssh
        };

        Restangular.all('spaces').post(space).then(function(space) {
          $mdDialog.hide();
          responseService.success(space, 'Space was created successfully', 'space-list', { organizationId : $scope.orgId });
        }, function(response) {
          if(response.status == '400' && response.data.message.indexOf('is taken') > -1)
            $scope.nameInUse = true;
          else
            responseService.error(response);
        })
      };


      $scope.prepareCreateServiceInstanceDialog = function(ev, space) {
        Restangular.one('spaces', space.metadata.guid).all('services').getList().then(function(services) {
          services.forEach(function(service) {
            service.plans = service.entity.service_plans;
          })
          $scope.showCreateServiceInstanceDialog(ev, space, services);

        }, function(response) {
          responseService.error(response);
        });
      }

      /*
       *  Dialog for
       *
       *  Create new Service Instance
       *
       */
      $scope.showCreateServiceInstanceDialog = function(ev, space, services) {
        $mdDialog.show({
          locals: {
            space: space,
            services: services
          },
          controller: ['$scope', 'space', 'services', function($scope, space, services) {
            $scope.space = space;
            $scope.services = services;
            $scope.tags = [];

            $scope.setService = function(service) {
              $scope.plans = service.plans;
            }

            $scope.submitCreateServiceInstanceForm = function(form) {
              var instance = {
                'space_guid': $scope.space.metadata.guid,
                'name': form.instanceName,
                'service_plan_guid': form.planId,
                'tags': $scope.tags
              };

              Restangular.all('service_instances').post(instance).then(function(instance) {
                $mdDialog.hide();
                responseService.success(instance, 'Creating new Service Instance...', 'service-list', { organizationId : $state.params.organizationId, spaceId : $scope.space.metadata.guid });
              }, function(response) {
                if(response.status == '400' && response.data.message.indexOf('is taken') > -1)
                  $scope.nameInUse = true;
                else if(response.status == '500' && response.data.message.indexOf('502') > -1)
                  responseService.error(response, 'Error. Please make sure that Application is running.');
                else
                  responseService.error(response);
              })
            };

            $scope.hide = function() {
              $mdDialog.hide();
            };

            $scope.cancel = function() {
              $mdDialog.cancel();
            };

          }],
          templateUrl: 'partials/space/space-create-service-instance-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false
        })
      };

      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.$on('doScroll', function (event, args) {
        var id = 'anc-' + args.target;
        var targetSpace = angular.element(document.getElementById(id));
        $document.scrollToElement(targetSpace, 30, 800);
      });

});
