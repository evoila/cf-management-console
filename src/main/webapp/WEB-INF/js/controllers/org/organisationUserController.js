/**
 * UserInfoController
 **/

define(function () {
	'use strict';	
	
	function UserInfoController($scope, $state, $location, Restangular, responseService) {
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
				var ids = [];

				angular.forEach(organization.users, function(user, userIndex){
					if(user.billingManager) {
						ids.push(user.id);
					}
				});

				Restangular.all('organizations').customPUT(organization.id, null, null, {user_guids: ids}).then(function(response) {
					responseService.executeSuccess(response, response.headers, null);
				});	
			}
		};

		/**
		Restangular.all('users').getList().then(function (users) {
			},
			function (response) {
				$scope.forceLogin(response.status);
				$scope.loading = false;
				$scope.error = 'Failed to retrieve users. Reason: ' + JSON.stringify(response.reason);
			}
		); **/

		Restangular.one('organizations', $state.params.organizationId).get().then(function (organization) {				
			$scope.organization = organization;
			$scope.users = organization.entity.users;
			$scope.loading = false;
		});
			
	}

	UserInfoController.$inject = ['$scope', '$state', '$location', 'Restangular', 'responseService'];

	return UserInfoController;
});