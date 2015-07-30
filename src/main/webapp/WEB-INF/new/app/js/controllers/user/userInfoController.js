/**
 * UserInfoController
 **/


  angular.module('controllers')
  	.controller('userInfoController',
  		function UserInfoController($scope, $state, $location, Restangular) {

		$scope.loading = true;
		Restangular.all('userinfo').getList().then(function(userInfo) {
			$scope.userInfo = userInfo;
			$scope.loading = false;
		});
});
