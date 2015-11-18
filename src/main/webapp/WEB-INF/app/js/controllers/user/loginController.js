/**
 * LoginController
 **/


angular.module('controllers')
  .controller('loginController',
    function LoginController($scope, $state, $rootScope, Restangular, clientCacheService, $http, responseService, envService, menu) {
      $scope.state = $state;
      $scope.authenticating = false;
      REST_API = envService.read('restApiUrl');

      function transformRequest(obj) {
        var str = [];
        for (var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
      }

      $scope.login = function(userForm) {
        var data = transformRequest({
          'grant_type': 'password',
          'username': userForm.email,
          'password': userForm.password
        });
        var head = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            'Accept': 'application/json;charset=utf-8'
          }
        };

        $http.post(REST_API + '/login', data, head).success(function(data, status, headers, config) {
          clientCacheService.authenticate(data);
          menu.initMenu(function(organization) {      
              $state.go('spaces', { organizationId : organization.metadata.guid });
          });
        }).error(function(data, status, headers) {
          responseService.error(data, "Invalid user credentials - or endpoint not reachable");
        });
      };

      return LoginController;
    });
