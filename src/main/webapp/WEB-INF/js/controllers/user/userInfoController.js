/**
 * UserInfoController
 **/

define(function () {
	'use strict';	
	
	function UserInfoController($scope, $state, $location, Restangular) {
		$scope.loading = true;
		Restangular.all('userinfo').getList().then(function(userInfo) {
			$scope.userInfo = userInfo;
			$scope.loading = false;
		});		
	}

	UserInfoController.$inject = ['$scope', '$state', '$location', 'Restangular'];

	return UserInfoController;
});