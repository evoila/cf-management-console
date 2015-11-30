/**
 * authenticationService
 **/
angular.module('services')
  .factory('authenticationService', function authenticationService($rootScope, $state, $http, $interval,
      clientCacheService, envService, menu, responseService) {
    var authentication = {};
    var timeout = 10 * 60 * 1000;
    REST_API = envService.read('restApiUrl');
    console.log('REST_API: ' + envService.read('restApiUrl'))

    var autoReAuthentication = $interval(function() {
      var now = new Date().getTime();

      if ((now - $rootScope.lastPageChange) < timeout)
        authentication.authenticate(false);

      else {
        $rootScope.hideLoginForm = false;
        authentication.logout();
      }

    }, 7.5 * 60 * 1000);

    authentication.authenticate = function(loadMenu, callback) {
      var user = clientCacheService.getUser();
      getToken(user, loadMenu);

      if (typeof(callback) == "function")
        callback();
    }

    authentication.login = function(user) {
      getToken(user, true);
    }

    authentication.logout = function() {
      clientCacheService.clearUser();
      $rootScope.isAuthenticated = false;

      $state.go('login');
    }

    authentication.isAuthenticated = function() {
      return $rootScope.isAuthenticated;
    }

    $rootScope.$on('$destroy', function() {
       $interval.cancel(autoReAuthentication);
     });

    function getToken(user, loadMenu) {
      if (user != undefined && user.password != undefined && user.username != null) {
        $rootScope.hideLoginForm = true;

        $http.defaults.headers.common['Authorization'] = 'bearer ' + user.token;

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

          if (loadMenu) {
            menu.initMenu(function(organization) {

              if($rootScope.previousState != '' && $state.current.name != '')
                $state.go($rootScope.previousState, $rootScope.previousParams);

              else {
                if ($state.current.name == 'login' || $state.current.name == "")
                  $state.go('spaces', {
                    organizationId: organization.metadata.guid
                  });
                else
                  $state.go($state.current.name, $state.params);
                }
            });
          }
        }).error(function(data, status, headers) {
          responseService.error(data, "Invalid user credentials - or endpoint not reachable");
        });
      } else {
        $rootScope.hideLoginForm = false;

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
