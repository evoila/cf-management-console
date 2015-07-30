/**
 * LoginController
 **/


  angular.module('controllers')
  	.controller('loginController',
  		function LoginController($scope, $state, $rootScope, Restangular, clientCacheService, $location, $http, responseService, REST_API) {
        $scope.state = $state;
		$scope.authenticating = false;

    function transformRequest(obj) {
        var str = [];
        for(var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
    }

		$scope.login = function (userForm) {
			$scope.authenticating = true;

			var data = transformRequest({'grant_type': 'password', 'username': userForm.email, 'password': userForm.password});
			var head = { headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
				'Accept': 'application/json;charset=utf-8'}
			};

		    $http.post(REST_API + '/login', data, head).success(function(data, status, headers, config) {
			    	clientCacheService.authenticate(data);
            $rootScope.isAuthenticated = true;

			    	$http.defaults.headers.common['Authorization'] = 'bearer ' + clientCacheService.getUser().accessToken;

					Restangular.all('organizations').getList().then(function(data) {
						if (data.length > 0) {
							responseService.executeSuccess(data, headers, 'dashboard');
							$location.path('/app-spaces/' + data[0].metadata.guid);
						} else {
							data = 'You are not associated with any organization, please ask an organization manager to add you an organization.';
							$scope.authenticating = false;
							responseService.executeError(data, status, headers, $scope, 'user');
						}
					});
			}).error(function (data, status, headers) {
				data = 'Invalid user credentials';
				$scope.authenticating = false;
				responseService.executeError(data, status, headers, $scope, 'user');
			});
		};

	return LoginController;
});
