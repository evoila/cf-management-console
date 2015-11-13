/**
 * UsersController
 **/

angular.module('controllers')
  .controller('usersController',
    function UsersController($scope, $state, Restangular, menu, clientCacheService, responseService, $mdDialog, $location) {
      console.log('user controller');
      $scope.state = $state;
      $scope.loading = true;
      $scope.blockInput = true;

      $scope.orgId = menu.organization.metadata.guid;
      var org = menu.organization;

      Restangular.one('users', $scope.orgId).get().then(function(orgUsers) {

        angular.forEach(orgUsers, function(orgUser, orgUserIndex) {

          var spacesUrl = org.entity.spaces_url.replace('/v2', '');
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
        $scope.loading = false;
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
        $scope.loading = true;

        Restangular.one('organizations', $scope.orgId).all('spaces').getList().then(function(data) {
          $state.go('edit-user', {organizationId : $scope.orgId, userId : user.metadata.guid, user : user});
        });
      }


      /*
       *  Dialog for
       *
       *  Create new user
       *
       */
      $scope.showCreateUserDialog = function(ev) {
        console.log($scope.processingSubmit);
        $mdDialog.show({
          controller: UsersController,
          templateUrl: 'partials/user/user-create-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false
        })
      };




      $scope.submitCreateUserForm = function(form) {
        console.log('Submitting: ' + form.username + ', ' + form.firstname + ', ' + form.lastname + ', ' + form.password);

        // rest: Create User
        Restangular.one('users').customPOST(undefined, undefined,({  username: form.username, firstName: form.firstname, lastName: form.lastname, password: form.password}),undefined).then(function(user) {
          var createdUserId = user.metadata.guid;

          // add new user to orga
          Restangular.one('users/' + createdUserId + '/organizations/' + $scope.orgId).customPUT(undefined, undefined,({ username: "dummy" }),undefined).then(function(user){
            responseService.executeSuccess(user, null, 'orgs/537abdc9-3331-407a-802f-42880cda82e2/users');
          }, function(response) {
              console.log('error add to org');
              console.log(response);
          })
          //$state.go($state.current, {}, {reload: true});

        }, function(response) {
            console.log('error create user');
            console.log(response);
        });
        $mdDialog.hide();
      };

      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };











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
