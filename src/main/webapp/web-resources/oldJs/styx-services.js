'use strict';

var styxServices = angular.module('styx.services', ['LocalStorageModule']);

styxServices.factory('cache', function ($http, localStorageService) {

    var cache = {};

    cache.storeOrganizations = function (organizations) {
        localStorageService.add("styx.organizations", JSON.stringify(organizations));
    }

    cache.clearOrganizations = function () {
        localStorageService.remove("styx.organizations");
    }

    cache.getOrganizations = function () {
        var organizations = localStorageService.get("styx.organizations");
        if (organizations) {
            return JSON.parse(organizations);
        }
        return organizations;
    }

    cache.storeUser = function (user) {
        localStorageService.add("styx.user", user);
    }

    cache.getUser = function () {
        return localStorageService.get("styx.user");
    }

    cache.storeFacts = function(facts) {
        localStorageService.add("styx.facts", facts);
    }

    cache.getFacts = function() {
        return localStorageService.get("styx.facts");
    }

    cache.clear = function () {
        localStorageService.clearAll();
    }

    return cache;

});

styxServices.factory('cloudfoundry', function ($http, cache, $q) {

    var cloudfoundry = {};

    var resourcePromise = function (endpoint, method, body) {
        var config = {
            method: method,
            url: endpoint,
            headers: {
                'Accept': 'application/json',
                'Authorization': 'bearer ' + cache.getUser().accessToken,
                'Content-Type': 'application/json'}
        }
        if (body !== null) {
            config.data = JSON.stringify(body);
        }
        var promise = $http(config);
        return promise;
    }

    var retrieveResource = function (promise, cacheFn) {
        promise.success = function (fn) {
            promise.then(function (response) {
                if (cacheFn) {
                    cacheFn(response.data);
                }
                fn(response.data, response.status, response.headers);
            });
            return promise;
        };
        promise.error = function (fn) {
            promise.then(null, function (response) {
                fn(response.data, response.status, response.headers);
            });
            return promise;
        };
        return promise;
    }

    cloudfoundry.getUser = function() {
        return cache.getUser();
    }

    cloudfoundry.isAuthenticated = function () {
        return cache.getUser() != null;
    }

    cloudfoundry.authenticate = function (userForm) {
        cache.clear();
        var promise = $http({
            method: 'POST',
            url: 'api/login',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                'Accept': 'application/json;charset=utf-8'},
            data: $.param({'grant_type': 'password',
                'username': userForm.email,
                'password': userForm.password})
        });
        return retrieveResource(promise, function (authenticationDetails) {
            cache.storeUser(authenticationDetails);
        });

    }

    cloudfoundry.register = function(userForm) {
        var promise = $http({
            method: 'POST',
            url: 'api/users',
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8', 'Accept': 'application/json;charset=utf-8'},
            data: $.param({'username': userForm.email, 'firstName': userForm.firstName, 'lastName': userForm.lastName, 'password': userForm.password})
        });
        return retrieveResource(promise);
    }

    cloudfoundry.updateOrganization = function (organizationId, body) {
        return retrieveResource(resourcePromise('api/organizations/' + organizationId, 'PUT', body), function (result) {
            cache.clearOrganizations();
        });
    }

    cloudfoundry.updateSpace = function (spaceId, body) {
        return retrieveResource(resourcePromise('api/spaces/' + spaceId, 'PUT', body), function (result) {
            cache.clearOrganizations();
        });
    }

    cloudfoundry.updateApplication = function(applicationId, body) {
        return retrieveResource(resourcePromise('api/applications/' + applicationId, 'PUT', body));
    }

    cloudfoundry.createOrganization = function (organizationForm) {
        var user = cache.getUser();
        var body = {'name': organizationForm.name, 'user_guids': [user.id], 'manager_guids': [user.id]};
        return retrieveResource(resourcePromise('api/organizations', 'POST', body), function (result) {
            cache.clearOrganizations();
        });
    }

    cloudfoundry.createSpace = function (organizationId, name) {
        var user = cache.getUser();
        var body = {'organization_guid': organizationId, 'name': name, 'manager_guids': [user.id], 'developer_guids': [user.id]};
        return retrieveResource(resourcePromise('api/spaces', 'POST', body));
    }

    cloudfoundry.deleteOrganization = function(organizationId) {
        return retrieveResource(resourcePromise('api/organizations/' + organizationId, 'DELETE', ''), function (result) {
            cache.clearOrganizations();
        });
    }

    cloudfoundry.deleteSpace = function(spaceId) {
        return retrieveResource(resourcePromise('api/spaces/' + spaceId, 'DELETE', ''));
    }

    cloudfoundry.deleteApplication = function(applicationId) {
        return retrieveResource(resourcePromise('api/applications/' + applicationId, 'DELETE', ''));
    }

    cloudfoundry.getOrganizations = function () {
        if (cache.getOrganizations() !== null) {
            var deferred = $q.defer();
            deferred.resolve(cache.getOrganizations());
            var promise = deferred.promise;
            promise.success = function (fn) {
                promise.then(function (organizations) {
                    fn(organizations, 200, null);
                });
            }
            promise.error = function (fn) {
                promise.then(null, function (reason) {
                    fn(reason, 200, null);
                });
            }
            return promise;
        }
        return retrieveResource(resourcePromise('api/organizations', 'GET'), function (organizations) {
            cache.storeOrganizations(organizations);
        });
    }

    cloudfoundry.getOrganization = function (organizationId) {
        if (cache.getOrganizations() !== null) {
            var deferred = $q.defer();
            var organizations = cache.getOrganizations();
            angular.forEach(organizations, function (item, index) {
                if (item.id === organizationId) {
                    deferred.resolve(item);
                }
            });
            var promise = deferred.promise;
            promise.success = function (fn) {
                promise.then(function (organization) {
                    fn(organization, 200, null);
                });
            }
            promise.error = function (fn) {
                promise.then(null, function (reason) {
                    fn(reason, 200, null);
                });
            }
            return promise;
        }
        return retrieveResource(resourcePromise('api/organizations/' + organizationId, 'GET'));
    }

    cloudfoundry.getApplication = function(applicationId) {
        return retrieveResource(resourcePromise('api/applications/' + applicationId, 'GET'));
    }

    cloudfoundry.getApplicationLog = function(applicationId, instanceId, fileName) {
        return retrieveResource(resourcePromise('api/applications/' + applicationId + '/instances/' + instanceId + '/logs/' + fileName, 'GET'));
    }

    cloudfoundry.getUserNames = function(filter){
        return retrieveResource(resourcePromise('cloud/uaa/ids/Users?filter=' + filter, 'GET'));
    }

    cloudfoundry.getSpaces = function (organizationId) {
        return retrieveResource(resourcePromise('api/organizations/' + organizationId + '/spaces', 'GET'));
    }

    cloudfoundry.getSpace = function(spaceId) {
        return retrieveResource(resourcePromise('api/spaces/' + spaceId, 'GET'));
    };

    cloudfoundry.getServices = function () {
        return retrieveResource(resourcePromise('api/services', 'GET'));
    }

    cloudfoundry.getUserInfo = function() {
        return retrieveResource(resourcePromise('api/userinfo', 'GET'));
    }

    cloudfoundry.logout = function () {
        cache.clear();
    }

    return cloudfoundry;

});
