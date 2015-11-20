/**
 * ClientCacheService
 **/
angular.module('services')
  .factory('clientCacheService', function ClientCacheService($rootScope, $http, localStorageService) {
    var cache = {};

    cache.storePassword = function(password) {
      localStorageService.add("cfmc.password", password);
      console.log("storepw clientCacheService",password)
    }

    cache.getPassword = function() {
      var password = localStorageService.get("cfmc.password");
      return password;
    }

    cache.storeUser = function(user) {
      localStorageService.add("cfmc.user", user);
    }

    cache.getUser= function() {
      var user = localStorageService.get("cfmc.user");
      return user;
    }

    cache.clearUser = function() {
      localStorageService.clearAll();
    }


    /**OLD PART**/

    cache.storeOrganizations = function(organizations) {
      localStorageService.add("cfmc.organizations", JSON.stringify(organizations));
    }

    cache.clearOrganizations = function() {
      localStorageService.remove("cfmc.organizations");
    }

    cache.getOrganizations = function() {
      var organizations = localStorageService.get("cfmc.organizations");
      if (organizations) {
        return JSON.parse(organizations);
      }
      return organizations;
    }

    /*cache.storeUser = function(user) {
      $rootScope.isAuthenticated = true;
      console.log(user);
      $http.defaults.headers.common['Authorization'] = 'bearer ' + user.accessToken;
      localStorageService.add("cfmc.user", user);
      localStorageService.add("cfmc.lastLogin", new Date().getTime());
      authService.loginConfirmed();
    }*/

    /* cache.getUser = function() {
      return localStorageService.get("cfmc.user");
    } */





    cache.storeFacts = function(facts) {
      localStorageService.add("cfmc.facts", facts);
    }

    cache.getFacts = function() {
      return localStorageService.get("cfmc.facts");
    }

    cache.clear = function() {
      localStorageService.clearAll();
    }

    cache.lastLogin = function() {
      return localStorageService.get("cfmc.lastLogin");
    }

    cache.loginTimedout = function() {
      var now = new Date().getTime();
      return now - cache.lastLogin() > 1000 * 60 * 60 * 12;
    }

    cache.isAuthenticated = function() {
      return cache.getUser() != null;
    };

    /*cache.authenticate = function(authenticationDetails) {
      var password = cache.getPassword();
      cache.clear();
      cache.storePassword(password);
      cache.storeUser(authenticationDetails);
    }*/

    /*cache.logout = function() {
      $rootScope.isAuthenticated = false;
      cache.clear();
    }*/

    return cache;
  });
