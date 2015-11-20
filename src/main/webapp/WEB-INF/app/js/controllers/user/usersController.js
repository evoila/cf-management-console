/**
 * UsersController
 **/

angular.module('controllers')
  .controller('usersController',
    function UsersController($scope, $state, Restangular, menu, clientCacheService, responseService, $mdDialog, $location) {
      console.log('user controller');

      $scope.blockInput = true;
      $scope.editMode = false;

      $scope.orgId = $state.params.organizationId;

      Restangular.one('organizations', $state.params.organizationId).get().then(function(org) {
        $scope.org = org;
      });

      // TODO: url for rest call should be sth like organizations.one...users
      Restangular.one('users', $scope.orgId).get().then(function(orgUsers) {

        angular.forEach(orgUsers, function(orgUser, orgUserIndex) {

          var spacesUrl = $scope.org.entity.spaces_url.replace('/v2', '');
          $scope.getSpacesOfOrganization(orgUser, spacesUrl);

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

      $scope.getSpacesOfOrganization = function(orgUser, spacesUrl) {
        Restangular.one(spacesUrl).get().then(function(spaces) {
          orgUser.spaces = [];
          spaces.forEach(function(space) {
            orgUser.spaces.push(space);
          })
        })
      }

      $scope.switchToEditUser = function(user) {
        Restangular.one('organizations', $scope.orgId).all('spaces').getList().then(function(data) {
          $state.go('user-edit', {organizationId : $scope.orgId, userId : user.metadata.guid, user : user});
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
        Restangular.one('users').customPOST(undefined, undefined,({  username: form.username, firstName: form.firstname, lastName: form.lastname, password: form.password}),undefined).then(function(user) {
          var createdUserId = user.metadata.guid;

          Restangular.one('users/' + createdUserId + '/organizations/' + $scope.orgId)
            .customPUT(undefined, undefined,({ username: "dummy" }),undefined).then(function(user){

            responseService.success(user, "User was created successfully", "users", { organizationId : $scope.orgId });
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
