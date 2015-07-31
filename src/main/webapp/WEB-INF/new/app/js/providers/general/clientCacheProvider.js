/**
 * clientCacheProvider
 **/
angular.module('providers')
  .provider('clientCacheProvider', function ClientCacheProvider($state, clientCacheService) {

    console.log(clientCacheService)
    console.log(clientCacheService.logout());

    var forceLogin = false;
    this.forceLogin = function(clientCacheService) {
      forceLogin = clientCacheService.logout();
      $state.go('/login');
    }

  });
