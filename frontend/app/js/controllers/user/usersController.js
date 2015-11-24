/**
 * UsersController
 **/

angular.module('controllers')
  .controller('usersController',
    function UsersController($scope, $state, Restangular, menu, clientCacheService, responseService, $mdDialog, $location, envService) {
      $scope.orgId = $state.params.organizationId;
      $scope.cfPrefix = envService.read('cf_prefix');

      $scope.init = function() {
        $scope.blockInput = true;
        $scope.editMode = false;

        Restangular.one('organizations', $state.params.organizationId).get().then(function(org) {
          $scope.org = org;
          getUsersAndOrgRoles();
        });
      }

      function getUsersAndOrgRoles() {
        Restangular.one('users', $scope.orgId).get().then(function(orgUsers) {
          angular.forEach(orgUsers, function(orgUser) {
            orgUser.isOrgManager = _.find($scope.org.entity.managers, function (ou) {
              if(ou.metadata.guid === orgUser.metadata.guid)
                return true;
            });
            orgUser.isOrgBillingManager = _.find($scope.org.entity.billing_managers, function (ou) {
              if(ou.metadata.guid === orgUser.metadata.guid)
                return true;
            });
            orgUser.isOrgAuditor = _.find($scope.org.entity.auditors, function (ou) {
              if(ou.metadata.guid === orgUser.metadata.guid)
                return true;
            });
          });
          $scope.orgUsers = orgUsers;
        }, function(response) {
            responseService.error(response);
        });
      }

      $scope.switchToEditUser = function(user) {
        $state.go('user-edit', {organizationId : $scope.orgId, userId : user.metadata.guid});
      }

      /*
       *  Dialog for
       *
       *  Confirm delete user
       *
       */
       $scope.showConfirm = function(ev, user) {
        var confirm = $mdDialog.confirm()
              .title('Really delete user?')
              .content(user.entity.username)
              .ariaLabel('Confirm delete')
              .targetEvent(ev)
              .ok('Yes')
              .cancel('Better not');
        $mdDialog.show(confirm).then(function() {
          deleteUser(user);
        });
      };

      function deleteUser(user) {
        Restangular.one('users', user.metadata.guid).remove().then(function() {
          responseService.success(user, 'User was deleted successfully', 'users', { organizationId : $scope.orgId });
        }, function(response) {
          responseService.error(response);
        });
      }

      /*
       *  Dialog for
       *
       *  Create new user
       *
       */
      $scope.showCreateUserDialog = function(ev) {
        $mdDialog.show({
          controller: UsersController,
          templateUrl: 'partials/user/user-create-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false
        })
      };

      $scope.submitCreateUserForm = function(form) {
        Restangular.all('users').post(form).then(function(user) {
          var createdUserId = user.metadata.guid;

          Restangular.one('users/' + createdUserId + '/organizations/' + $scope.orgId)
            .customPUT(undefined, undefined,({ username: 'dummy' }),undefined).then(function(user){
            responseService.success(user, 'User was created successfully', 'users', { organizationId : $scope.orgId });
          }, function(response) {
              responseService.error(response);
          })

        }, function(response) {
            responseService.error(response);
        });
        $mdDialog.hide();
      };

      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

});
