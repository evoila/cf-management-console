/**
 * AppSpacesController
 **/

angular.module('controllers')
  .controller('spaceListController',
    function SpaceListController($scope, $state, $mdDialog, $rootScope, $document, Restangular, responseService, menu, DesignService) {
      $scope.spaces = menu.spaces;
      $scope.orgId = $state.params.organizationId;

      Restangular.one('organizations', $state.params.organizationId).all('spaces').getList().then(function(spaces) {
        $scope.spaces = spaces;
      });

      $scope.colorString = function(name) {
        var myColor = DesignService.stringColor(name);
        return myColor;
      };

      $scope.servicePng = function(name) {
        var myService = DesignService.resolveServicePng(name);
        return myService;
      };

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
          responseService.success(space, 'Space was created successfully', 'spaces', { organizationId : $scope.orgId });
        }, function(response) {
          if(response.status == '400' && response.data.message.indexOf('is taken') > -1)
            responseService.error(response, 'Space name already in use');
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
