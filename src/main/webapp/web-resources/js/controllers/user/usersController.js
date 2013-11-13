/**
 * UsersController
 **/

define(function () {
	'use strict';	
	
	function UsersController($scope) {
		$scope.loading = true;
		$scope.blockInput = true;

		var containsUser = function(spaceUsers, orgUser){
			for(var i=0;i<spaceUsers.length;i++){
				var spaceUser = spaceUsers[i];
				if(orgUser.id === spaceUser.id){
					return true;
				}
			}
			return false;
		}

		userManager.getUsers($stateParams.organizationId).then(function (organization) {
			$scope.loggedInUser = cloudfoundry.getUser();
			var mayManipulate = false;
			angular.forEach(organization.data.users, function(orgUser, orgUserIndex){
				if($scope.loggedInUser.id === orgUser.id && orgUser.manager){
					mayManipulate = true;
				}
				angular.forEach(organization.data.spaces, function(space, spaceIndex){
					if(!containsUser(space.users, orgUser)){
						space.users.push({id:orgUser.id, username:orgUser.username, developer:false, manager:false, auditor:false});
					}
				});
			});
			$scope.selectedGroup = organization.data.name;
			$scope.showOrganizationUsers = true;
			$scope.organization = organization.data;
			$scope.loading = false;
			if(mayManipulate === true){
				$scope.blockInput = false;
			}
		}, function (response) {
			$scope.forceLogin(response.status);
			$scope.loading = false;
			$scope.error = 'Failed to retrieve organization users. Reason: ' + JSON.stringify(response);
		});

		$scope.openConfirmation = function(user){
			$scope.selectedUser = user;
			$scope.confirmationRequested = true;
		};

		$scope.closeConfirmation = function(){
			$scope.selectedUser = 'undefined';
			$scope.confirmationRequested = false;
		};

		$scope.addNewUser = function (organization) {
			$location.path("/organization/" + organization.id + "/users");
		};

		$scope.removeUser = function (organization, user) {
			$scope.blockInput = true;
			$scope.confirmationRequested = false;
			var index = organization.users.indexOf(user);
			organization.users.splice(index, 1);
			userManager.setOrgUsers(organization).then(
				function (result, status, headers) {
					$scope.blockInput = false;
				},
				function (reason, status, headers) {
					$scope.blockInput = false;
					$scope.error = 'Failed to remove user from organization ' + organization.name + '. Reason: ' + JSON.stringify(reason.data);
					organization.users.push(user);
				}
			);
		};

		$scope.setOrgManager = function (organization) {
			$scope.blockinput = true;
			userManager.setOrgManagers(organization).then(
				function (result, status, headers) {
					$scope.blockinput = false;
				},
				function (result, status, headers) {
					$scope.blockinput = false;
					$scope.error = 'Failed to add manager to organization ' + organization.name + '. Reason: ' + JSON.stringify(reason.data);
				}
			);
		};

		$scope.setOrgBillingManager = function (organization, user) {
			$scope.blockinput = true;
			userManager.setOrgBillingManagers(organization).then(
				function (result, status, headers) {
					$scope.blockinput = false;
				},
				function (result, status, headers) {
					$scope.blockinput = false;
					$scope.error = 'Failed to add billing manager to organization ' + organization.name + '. Reason: ' + JSON.stringify(reason.data);
				}
			);
		};

		$scope.setOrgAuditor = function (organization, user) {
			$scope.blockinput = true;
			userManager.setOrgAuditors(organization).then(
				function (result, status, headers) {
					$scope.blockinput = false;
				},
				function (result, status, headers) {
					$scope.blockinput = false;
					$scope.error = 'Failed to add auditor to organization ' + organization.name + '. Reason: ' + JSON.stringify(reason.data);
				}
			);
		};

		$scope.setSpaceManager = function (space, user) {
			$scope.blockinput = true;
			userManager.setSpaceManagers(space).then(
				function (result, status, headers) {
					$scope.blockinput = false;
				},
				function (result, status, headers) {
					$scope.blockinput = false;
					$scope.error = 'Failed to add manager to space ' + space.name + '. Reason: ' + JSON.stringify(reason.data);
				}
			);
		};

		$scope.setSpaceDeveloper = function (space, user) {
			$scope.blockinput = true;
			userManager.setSpaceDevelopers(space).then(
				function (result, status, headers) {
					$scope.blockinput = false;
				},
				function (result, status, headers) {
					$scope.error = 'Failed to add developer to space ' + space.name + '. Reason: ' + JSON.stringify(reason.data);
				}
			);
		};

		$scope.setSpaceAuditor = function (space, user) {
			$scope.blockinput = true;
			userManager.setSpaceAuditors(space).then(
				function (result, status, headers) {
					$scope.blockinput = false;
				},
				function (result, status, headers) {
					$scope.error = 'Failed to add auditor to space ' + space.name + '. Reason: ' + JSON.stringify(reason.data);
				}
			);
		};

		$scope.selectOrganizationUsers = function (organizationName) {
			$scope.selectedGroup = organizationName;
			$scope.showOrganizationUsers = true;
		};
		
		$scope.selectSpaceUsers = function (spaceName, organization) {
			$scope.selectedGroup = spaceName;
			angular.forEach(organization.spaces, function (item, index) {
				if (item.name === spaceName) {
					$scope.selectedSpace = item;
					$scope.showOrganizationUsers = false;
				}
			});
		}
	}

	UsersController.$inject = ['$scope'];

	return UsersController;
});