/**
 * ClientCacheService
 **/

define(['angular'], function (angular) {
	"use strict";

	var service = function(localStorageService) {
		var cache = {};

		cache.storeOrganizations = function(organizations) {
			localStorageService.add("styx.organizations", JSON.stringify(organizations));
		}

		cache.clearOrganizations = function() {
			localStorageService.remove("styx.organizations");
		}

		cache.getOrganizations = function() {
			var organizations = localStorageService.get("styx.organizations");
			if (organizations) {
				return JSON.parse(organizations);
			}
			return organizations;
		}

		cache.storeUser = function(user) {
			localStorageService.add("styx.user", user);
		}

		cache.getUser = function() {
			return localStorageService.get("styx.user");
		}

		cache.storeFacts = function(facts) {
			localStorageService.add("styx.facts", facts);
		}

		cache.getFacts = function() {
			return localStorageService.get("styx.facts");
		}

		cache.clear = function() {
			localStorageService.clearAll();
		}

		cache.isAuthenticated = function() {
			return cache.getUser() != null;
		};

		cache.authenticate = function(authenticationDetails) {
			cache.clear();			
			cache.storeUser(authenticationDetails);
		}

		cache.logout = function() {
			cache.clear();
		}

		return cache;

	}
	service.$inject = ['localStorageService'];

	return service;
});
