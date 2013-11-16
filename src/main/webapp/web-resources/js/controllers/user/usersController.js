/**
 * UsersController
 **/

define(function () {
	'use strict';	
	
	function UsersController($scope, $state, $location, Restangular, clientCacheService, responseService) {
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
		};

		Restangular.one('organizations', $state.params.organizationId).getList().then(function (organization) {
			$scope.loggedInUser = clientCacheService.getUser();
			var mayManipulate = false;

			angular.forEach(organization.users, function(orgUser, orgUserIndex){
				if($scope.loggedInUser.id === orgUser.id && orgUser.manager){
					mayManipulate = true;
				}
				angular.forEach(organization.spaces, function(space, spaceIndex){
					if(!containsUser(space.users, orgUser)){
						space.users.push({id : orgUser.id, username:orgUser.username, developer : false, manager : false, auditor : false});
					}
				});
			});
			$scope.selectedGroup = organization.name;
			$scope.showOrganizationUsers = true;
			$scope.organization = organization;
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
			$scope.updateEntity('organizations', space.id, extractUserIds(organization.users), "manager_guids");			
		};

		$scope.setOrgBillingManager = function (organization, user) {
			$scope.updateEntity('organizations', space.id, extractUserIds(organization.users), "billing_manager_guids");
		};

		$scope.setOrgAuditor = function (organization, user) {
			$scope.updateEntity('organizations', space.id, extractUserIds(organization.users), "auditor_guids");		
		};

		$scope.setSpaceManager = function (space, user) {
			$scope.updateEntity('spaces', space.id, extractUserIds(space.users), "manager_guids");
		};

		$scope.setSpaceDeveloper = function (space, user) {
			$scope.updateEntity('spaces', space.id, extractUserIds(space.users), "developer_guids");
		};

		$scope.setSpaceAuditor = function (space, user) {
			$scope.updateEntity('spaces', space.id, extractUserIds(space.users), "auditor_guids");
		};

		$scope.extractUserIds = function(users) {
			var ids = [];

			angular.forEach(users, function(user, userIndex){
				if(user.billingManager) {
					ids.push(user.id);
				}
			});
			return ids;
		};

		$scope.updateEntity = function(entity, entityId, userIds, type) {
			$scope.blockinput = true;
			Restangular.all(entity).customPUT(entityId, null, null, {type: userIds}).then(function(response) {
				responseService.executeSuccess(response, response.headers, null);
				$scope.blockinput = false;
			});	
		}

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

	UsersController.$inject = ['$scope', '$state', '$location', 'Restangular', 'clientCacheService', 'responseService'];

	return UsersController;
});