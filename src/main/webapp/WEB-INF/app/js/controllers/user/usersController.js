/**
 * UsersController
 **/

angular.module('controllers')
  .controller('usersController',
    function UsersController($scope, $state, Restangular, menu, clientCacheService, responseService, $mdDialog, $location, envService) {
      console.log('user controller');

      $scope.orgId = $state.params.organizationId;
      $scope.prefix = envService.read('cf_prefix');

      $scope.init = function() {
        $scope.blockInput = true;
        $scope.editMode = false;

        Restangular.one('organizations', $state.params.organizationId).get().then(function(org) {
          $scope.org = org;
          var spacesUrl = $scope.org.entity.spaces_url.replace($scope.prefix, '');
          Restangular.one(spacesUrl).get().then(function(spaces) {
            $scope.spaces = spaces;
            prepareUsers();
          })
        });
      }

      function prepareUsers() {
        Restangular.one('users', $scope.orgId).get().then(function(orgUsers) {

          angular.forEach(orgUsers, function(orgUser, orgUserIndex) {
            orgUser.spaces = $scope.spaces;

            orgUser.isOrgManager = false;
            orgUser.entity.managed_organizations.forEach(function(org) {
              if(org.metadata.guid == $scope.orgId)
                orgUser.isOrgManager = true;
            })

            orgUser.billingManagedOrgs = orgUser.entity.billing_managed_organizations;
            orgUser.auditedOrgs = orgUser.entity.audited_organizations;

            orgUser.managedSpaces = orgUser.entity.managed_spaces;
            orgUser.auditedSpaces = orgUser.entity.audited_spaces;
          });
          $scope.orgUsers = orgUsers;
        }, function(response) {
            responseService.error(response);
        });
      }

      $scope.switchToEditUser = function(user) {
        Restangular.one('organizations', $scope.orgId).all('spaces').getList().then(function(data) {
          $state.go('user-edit', {organizationId : $scope.orgId, userId : user.metadata.guid, user : user});
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
              .content(user.entity.username)
              .ariaLabel('Confirm delete')
              .targetEvent(ev)
              .ok('Yes')
              .cancel('Better not');
        $mdDialog.show(confirm).then(function() {
          deleteUser(user);
        }, function() {

        });
      };

      function deleteUser(user) {
        Restangular.one('users', user.metadata.guid).remove().then(function() {
          responseService.success(user, 'User was deleted successfully', 'users', { organizationId : $scope.orgId });
        }, function(response) {
          console.log(response);
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
