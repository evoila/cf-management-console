/**
 * ClientCacheService
 **/

define(['angular'], function (angular) {
	"use strict";

	var service = function(localStorageService) {
		var cache = {};

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

		cache.storeUser = function(user) {
			localStorageService.add("cfmc.user", user);
		}

		cache.getUser = function() {
			return localStorageService.get("cfmc.user");
		}

		cache.storeFacts = function(facts) {
			localStorageService.add("cfmc.facts", facts);
		}

		cache.getFacts = function() {
			return localStorageService.get("cfmc.facts");
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
