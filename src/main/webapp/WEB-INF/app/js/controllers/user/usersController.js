/**
 * UsersController
 **/

angular.module('controllers')
  .controller('usersController',
    function UsersController($scope, $state, Restangular, menu, clientCacheService, responseService) {

      $scope.state = $state;
      $scope.loading = true;
      $scope.organizationId = $state.params.organizationId;
      $scope.blockInput = true;

      var containsUser = function(spaceUsers, orgUser) {
        for (var i = 0; i < spaceUsers.length; i++) {
          var spaceUser = spaceUsers[i];
          if (orgUser.id === spaceUser.id) {
            return true;
          }
        }
        return false;
      };

      $scope.loading = false;

      Restangular.one('orgUsers', $state.params.organizationId).get().then(function(orgUsers) {
        angular.forEach(orgUsers, function(orgUser, orgUserIndex) {
          console.log('orgUser: ' + orgUser.metadata.guid);
        });
      });

      /*
      Restangular.one('organizations', $state.params.organizationId).get().then(function(organization) {
        $scope.loggedInUser = clientCacheService.getUser();
        var mayManipulate = false;

        //console.log('org: ' + JSON.stringify(organization));
        console.log('org: ' + organization[0].entity.name);

        var orgUsers = organization[0].entity.users;
        console.log('orgUsers: ' + orgUsers.length);

        console.log('logged in user id: ' + $scope.loggedInUser.id);

        angular.forEach(orgUsers, function(orgUser, orgUserIndex) {
          if ($scope.loggedInUser.id === orgUser.metadata.guid && orgUser.manager) {
            mayManipulate = true;
            console.log('mayManipulate = true');
          }

          var orgSpaces = organization[0].entity.spaces;
          console.log('orgSpaces: ' + orgSpaces.length);

          angular.forEach(orgSpaces, function(space, spaceIndex) {
            //if (!containsUser(space.users, orgUser)) {
              space.users.push({
                id: orgUser.metadata.guid,
                username: orgUser.metadata.username,
                developer: false,
                manager: false,
                auditor: false
              });
            //}
          });
        });

        $scope.selectedGroup = organization.name;
        $scope.showOrganizationUsers = true;
        $scope.organization = organization;
        $scope.loading = false;

        if (mayManipulate === true) {
          $scope.blockInput = false;
        }
      }, function(response) {
        $scope.forceLogin(response.status);
        $scope.loading = false;
        $scope.error = 'Failed to retrieve organization users. Reason: ' + JSON.stringify(response);
      });
      */

      $scope.openConfirmation = function(user) {
        $scope.selectedUser = user;
        $scope.confirmationRequested = true;
      };

      $scope.closeConfirmation = function() {
        $scope.selectedUser = 'undefined';
        $scope.confirmationRequested = false;
      };

      $scope.removeUser = function(organization, user) {
        $scope.blockInput = true;
        $scope.confirmationRequested = false;
        var index = organization.users.indexOf(user);
        organization.users.splice(index, 1);
        userManager.setOrgUsers(organization).then(
          function(result, status, headers) {
            $scope.blockInput = false;
          },
          function(reason, status, headers) {
            $scope.blockInput = false;
            $scope.error = 'Failed to remove user from organization ' + organization.name + '. Reason: ' + JSON.stringify(reason.data);
            organization.users.push(user);
          }
        );
      };

      $scope.setOrgManager = function(organization) {
        $scope.updateEntity('organizations', space.id, extractUserIds(organization.users), "manager_guids");
      };

      $scope.setOrgBillingManager = function(organization, user) {
        $scope.updateEntity('organizations', space.id, extractUserIds(organization.users), "billing_manager_guids");
      };

      $scope.setOrgAuditor = function(organization, user) {
        $scope.updateEntity('organizations', space.id, extractUserIds(organization.users), "auditor_guids");
      };

      $scope.setSpaceManager = function(space, user) {
        $scope.updateEntity('spaces', space.id, extractUserIds(space.users), "manager_guids");
      };

      $scope.setSpaceDeveloper = function(space, user) {
        $scope.updateEntity('spaces', space.id, extractUserIds(space.users), "developer_guids");
      };

      $scope.setSpaceAuditor = function(space, user) {
        $scope.updateEntity('spaces', space.id, extractUserIds(space.users), "auditor_guids");
      };

      $scope.extractUserIds = function(users) {
        var ids = [];

        angular.forEach(users, function(user, userIndex) {
          if (user.billingManager) {
            ids.push(user.id);
          }
        });
        return ids;
      };

      $scope.updateEntity = function(entity, entityId, userIds, type) {
        $scope.blockinput = true;
        Restangular.all(entity).customPUT(entityId, null, null, {
          type: userIds
        }).then(function(response) {
          responseService.executeSuccess(response, response.headers, null);
          $scope.blockinput = false;
        });
      }

      $scope.selectOrganizationUsers = function(organizationName) {
        $scope.selectedGroup = organizationName;
        $scope.showOrganizationUsers = true;
      };

      $scope.selectSpaceUsers = function(spaceName, organization) {
        $scope.showOrganizationUsers = false; //
        $scope.selectedGroup = spaceName;
        angular.forEach(organization.spaces, function(item, index) {
          if (item.name === spaceName) {
            $scope.selectedSpace = item;
            $scope.showOrganizationUsers = false;
          }
        });
      }
    });
