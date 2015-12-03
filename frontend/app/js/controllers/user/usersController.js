/**
 * UsersController
 **/

angular.module('controllers')
  .controller('usersController',
    function UsersController($scope, $state, Restangular, menu, clientCacheService, responseService, $mdDialog, $location, envService) {
      $scope.orgId = $state.params.organizationId;
      $scope.cfPrefix = envService.read('cf_prefix');

      var originatorEv;

      $scope.query = {
        filter: '',
        order: 'entity.username',
        limit: 10,
        page: 1
      };

      $scope.openMenu = function($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
      };

      $scope.init = function() {
        Restangular.one('organizations', $state.params.organizationId).get().then(function(org) {
          $scope.org = org;
          getUsersAndOrgRoles();
        }, function(response) {
          responseService.error(response);
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
        var spacesUrl = $scope.org.entity.spaces_url.replace($scope.cfPrefix, '');
        Restangular.one(spacesUrl).get().then(function(spaces) {
          user.spaces = spaces;
          $state.go('user-edit', {organizationId : $scope.orgId, orgName : $scope.org.entity.name, userId : user.metadata.guid, user : user});
        }, function(response) {
          responseService.error(response);
        });
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
              .textContent(user.entity.username)
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
          $mdDialog.hide();
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
            .customPUT(undefined, undefined,({ username: 'dummy' }),undefined).then(function(user) {
            $mdDialog.hide();
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
