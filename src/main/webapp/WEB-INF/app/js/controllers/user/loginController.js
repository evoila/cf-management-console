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
        $scope.authenticating = true;

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

          Restangular.all('organizations').getList().then(function(data) {
            if (data.length > 0) {
              responseService.success(data, "Successfully logged in!", 'spaces');
              menu.orgsToMenu(data);
              $state.go('spaces', {
                  organizationId: data[0].metadata.guid
              })
            } else {
              $scope.authenticating = false;
              responseService.error(data, "You are not associated with any organization, please ask an organization manager to add you an organization.");
            }
          });
        }).error(function(data, status, headers) {
          $scope.authenticating = false;
          responseService.error(data, "Invalid user credentials - or endpoint not reachable");
        });
      };

      return LoginController;
    });
