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
