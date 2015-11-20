/**
 * authenticationService
 **/
angular.module('services')
  .factory('authenticationService', function authenticationService($rootScope, $state, $http, clientCacheService, envService, menu, responseService) {
    var authentication = {};
    REST_API = envService.read('restApiUrl');

    authentication.authenticate = function(callback) {

      var user = clientCacheService.getUser();
      $http.defaults.headers.common['Authorization'] = 'bearer ' + user.token;
      getToken(user);

      if (typeof(callback) == "function")
        callback();

    }

    authentication.login = function(user) {
      getToken(user);
    }

    authentication.logout = function() {
      clientCacheService.clearUser();
      $rootScope.isAuthenticated = false;

      $state.go('login');
    }

    function getToken(user) {
      if (user != undefined && user.password != undefined && user.username != null) {
        var data = transformRequest({
          'grant_type': 'password',
          'username': user.username,
          'password': user.password
        });
        var head = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            'Accept': 'application/json;charset=utf-8'
          }
        };

        $http.post(REST_API + '/login', data, head).success(function(data, status, headers, config) {

          $http.defaults.headers.common['Authorization'] = 'bearer ' + data.accessToken;
          $rootScope.isAuthenticated = true;

          user.token = data.accessToken;
          clientCacheService.storeUser(user);

          menu.initMenu(function(organization) {
            if ($state.current.name == 'login' || $state.current.name == "")
              $state.go('spaces', {
                organizationId: organization.metadata.guid
              });
            else
              $state.go($state.current.name, $state.params);
          });
        }).error(function(data, status, headers) {
          responseService.error(data, "Invalid user credentials - or endpoint not reachable");
        });
      } else {
        clientCacheService.clearUser();
        $state.go('login');
      }
    }

    function transformRequest(obj) {
      var str = [];
      for (var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      return str.join("&");
    }

    return authentication;
  });
