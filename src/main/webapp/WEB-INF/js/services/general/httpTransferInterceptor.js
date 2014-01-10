define(['angular'], function (angular) {
    "use strict";

    var service = function ($q, $rootScope) {
        return {
            request: function (config) {
                console.log('Interceptor requesting');
                return config || $q.when(config);
            },
            requestError: function (rejection) {
                console.log('request error');
                return $q.reject(rejection);
            },
            response: function (response) {
                console.log('response');
                return response || $q.when(response);
            },
            responseError: function (response) {
                // do something on error
                console.log('interceptor threw error');
                if (response.status === 0) {
                    // network is down?
                    console.log('Network connection seems to be down');
                    // Fire event to show popup box for telling the user that the server is not available in time
                    $rootScope.$emit('$triggerPopup', {
                        id: 'fooBar'
                    });
                } else if (response.status === 401) {
                    // access denied? do something...
                    console.log('got 401');

                } else if (response.status === 500) {
                    console.log('error was 500');

                }
                return $q.reject(response);
            }

        }

    }
    service.$inject = [];

    return service;
});