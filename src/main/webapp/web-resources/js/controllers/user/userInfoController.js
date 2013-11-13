/**
 * UserInfoController
 **/

define(function () {
	'use strict';	
	
	function UserInfoController($scope) {
		$scope.loading = true;
		var userInfoPromise = cloudfoundry.getUserInfo();
		userInfoPromise.success(function (data, status, headers) {
			$scope.userInfo = data;
			$scope.loading = false;
		});
		userInfoPromise.error(function (data, status, headers) {
			$scope.error = 'Failed to get user info. Reason: ' + data.code + ' - ' + data.description;
		});
	}

	UserInfoController.$inject = ['$scope'];

	return UserInfoController;
});