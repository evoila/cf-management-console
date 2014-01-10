/**
 * CookieService
 **/

define(['angular'], function (angular) {
	"use strict";

	var angularLocalStorage = function($rootScope) {
		var prefix = 'ls';
		var cookie = { expiry:30, path: '/'};
		var notify = { setItem: true, removeItem: false};

		if (prefix.substr(-1)!=='.') {
			prefix = !!prefix ? prefix + '.' : '';
	  	}

		var browserSupportsLocalStorage = function () {
			try {
				return ('localStorage' in window && window['localStorage'] !== null);
			} catch (e) {
				$rootScope.$broadcast('LocalStorageModule.notification.error',e.message);
				return false;
			}
	  	};
		
		var addToLocalStorage = function (key, value) {
			if (!browserSupportsLocalStorage()) {
		  		$rootScope.$broadcast('LocalStorageModule.notification.warning','LOCAL_STORAGE_NOT_SUPPORTED');
		  	
		  		if (notify.setItem) {
					$rootScope.$broadcast('LocalStorageModule.notification.setitem', {key: key, newvalue: value, storageType: 'cookie'});
		  		}
		  		return addToCookies(key, value);
			}

			if (typeof value == "undefined") value = null;

			try {
		  		if (angular.isObject(value)) {
			  		value = angular.toJson(value);
		  		}
		  		
		  		localStorage.setItem(prefix+key, value);
		  		
		  		if (notify.setItem) {
					$rootScope.$broadcast('LocalStorageModule.notification.setitem', {key: key, newvalue: value, storageType: 'localStorage'});
		  		}
			} catch (e) {
		  		$rootScope.$broadcast('LocalStorageModule.notification.error',e.message);
		  		return addToCookies(key, value);
			}
			return true;
	  	};

		var getFromLocalStorage = function (key) {
			if (!browserSupportsLocalStorage()) {
		  		$rootScope.$broadcast('LocalStorageModule.notification.warning','LOCAL_STORAGE_NOT_SUPPORTED');
		  		return getFromCookies(key);
			}

			var item = localStorage.getItem(prefix+key);
			
			if (!item) return null;
			if (item.charAt(0) === "{") {
				return angular.fromJson(item);
			}
			return item;
	  	};

		var removeFromLocalStorage = function (key) {
			if (!browserSupportsLocalStorage()) {
				$rootScope.$broadcast('LocalStorageModule.notification.warning','LOCAL_STORAGE_NOT_SUPPORTED');
			   	if (notify.removeItem) {
					$rootScope.$broadcast('LocalStorageModule.notification.removeitem', {key: key, storageType: 'cookie'});
			  	}
			  	return removeFromCookies(key);
			}

			try {
		  		localStorage.removeItem(prefix+key);
		  		if (notify.removeItem) {
					$rootScope.$broadcast('LocalStorageModule.notification.removeitem', {key: key, storageType: 'localStorage'});
		  		}
			} catch (e) {
		  		$rootScope.$broadcast('LocalStorageModule.notification.error',e.message);
		  		return removeFromCookies(key);
			}
			return true;
		};

		var clearAllFromLocalStorage = function () {

			if (!browserSupportsLocalStorage()) {
		  		$rootScope.$broadcast('LocalStorageModule.notification.warning','LOCAL_STORAGE_NOT_SUPPORTED');
		  		return clearAllFromCookies();
			}

			var prefixLength = prefix.length;

			for (var key in localStorage) {
		  		if (key.substr(0,prefixLength) === prefix) {
					try {
				  		removeFromLocalStorage(key.substr(prefixLength));
					} catch (e) {
			  			$rootScope.$broadcast('LocalStorageModule.notification.error',e.message);
			  			return clearAllFromCookies();
					}
		  		}
			}
			return true;
		};

	  	var browserSupportsCookies = function() {
			try {
		  		return navigator.cookieEnabled ||
					("cookie" in document && (document.cookie.length > 0 ||
					(document.cookie = "test").indexOf.call(document.cookie, "test") > -1));
			} catch (e) {
		  		$rootScope.$broadcast('LocalStorageModule.notification.error',e.message);
		  		return false;
			}
		};
	  	
	  	var addToCookies = function (key, value) {

			if (typeof value == "undefined") return false;

			if (!browserSupportsCookies()) {
		  		$rootScope.$broadcast('LocalStorageModule.notification.error','COOKIES_NOT_SUPPORTED');
		  		return false;
			}

			try {
		  		var expiry = '', expiryDate = new Date();
		  		if (value === null) {
					cookie.expiry = -1;
					value = '';
		  		}
		  
		  		if (cookie.expiry !== 0) {
					expiryDate.setTime(expiryDate.getTime() + (cookie.expiry*24*60*60*1000));
					expiry = "; expires="+expiryDate.toGMTString();
		  		}
		  		if (!!key) {
					document.cookie = prefix + key + "=" + encodeURIComponent(value) + expiry + "; path="+cookie.path;
		  		}
			} catch (e) {
		  		$rootScope.$broadcast('LocalStorageModule.notification.error',e.message);
		  		return false;
			}
			return true;
		};

	  	var getFromCookies = function (key) {
			if (!browserSupportsCookies()) {
		  		$rootScope.$broadcast('LocalStorageModule.notification.error','COOKIES_NOT_SUPPORTED');
		  		return false;
			}

			var cookies = document.cookie.split(';');
			for(var i=0;i < cookies.length;i++) {
		  		var thisCookie = cookies[i];
		  		while (thisCookie.charAt(0)==' ') {
					thisCookie = thisCookie.substring(1,thisCookie.length);
		  		}
		  		if (thisCookie.indexOf(prefix+key+'=') === 0) {
					return decodeURIComponent(thisCookie.substring(prefix.length+key.length+1,thisCookie.length));
		  		}
			}
			return null;
		};

		var removeFromCookies = function (key) {
			addToCookies(key,null);
	  	};

		var clearAllFromCookies = function () {
			var thisCookie = null, thisKey = null;
			var prefixLength = prefix.length;
			var cookies = document.cookie.split(';');
			for(var i=0;i < cookies.length;i++) {
				thisCookie = cookies[i];
			 	while (thisCookie.charAt(0)==' ') {
					thisCookie = thisCookie.substring(1,thisCookie.length);
			  	}
			  	key = thisCookie.substring(prefixLength,thisCookie.indexOf('='));
			  	removeFromCookies(key);
			}
		};

		return {
			isSupported: browserSupportsLocalStorage,
			set: addToLocalStorage, 
			add: addToLocalStorage, //DEPRECATED
			get: getFromLocalStorage,
			remove: removeFromLocalStorage,
			clearAll: clearAllFromLocalStorage,
			cookie: {
				set: addToCookies,
				add: addToCookies, //DEPRECATED
				get: getFromCookies,
				remove: removeFromCookies,
				clearAll: clearAllFromCookies
			}
		};

	};

	angularLocalStorage.$inject = ['$rootScope'];


	return angularLocalStorage;
});

