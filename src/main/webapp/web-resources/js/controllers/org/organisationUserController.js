/**
 * UserInfoController
 **/

define(function () {
	'use strict';	
	
	function UserInfoController($scope) {
		$scope.loading = true;

		var containsUser = function (orgUsers, userId) {
			for (var i = 0; i < orgUsers.length; i++) {
				if (orgUsers[i].id === userId) {
					return true;
				}
			}
			return false;
		};

		$scope.addUser = function (organization, user) {
			if (user) {
				organization.users.push(user);
				userManager.setOrgUsers(organization).then(
					function (result, status, headers) {
						$location.path('/users/' + organization.id);
					},
					function (reason, status, headers) {
						$scope.forceLogin(status);
						$scope.error = 'Failed to set user role for ' + user.userName + ' user details. Reason: ' + JSON.stringify(reason.data);
					}
				);
			}
		}
		
		userManager.getAllUsers().then(
			function (users, status, headers) {
				userManager.getUsers($stateParams.organizationId).then(
					function (organization, status, headers) {
						var filteredUsers = [];
						angular.forEach(users.data, function (user, userIndex) {
							if (!containsUser(organization.data.users, user.id)) {
								filteredUsers.push(user);
							}
						});
						$scope.organization = organization.data;
						$scope.users = filteredUsers;
						$scope.loading = false;
					},
					function (reason, status, headers) {
						$scope.loading = false;
						$scope.error = 'Failed to retrieve users details. Reason: ' + JSON.stringify(reason.data);
					}
				);
			},
			function (response) {
				$scope.forceLogin(response.status);
				$scope.loading = false;
				$scope.error = 'Failed to retrieve users. Reason: ' + JSON.stringify(response.reason);
			}
		);
	}

	UserInfoController.$inject = ['$scope'];

	return UserInfoController;
});