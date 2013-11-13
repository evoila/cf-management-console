/**
 * CookieService
 **/
define(['angular'], function (angular) {
	"use strict";

	var service = function($rootScope, $http, cookieService) {
		$rootScope.userDetails = null;
		var seconds = 60 * 30, id, token, name, profilePicture;
			
		var handler = { 
			store : function(id, token, name, profilePicture) {
				if (id !== null && token !== null) {
					$rootScope.userDetails = {
						id : id,
						token : token,
						name : name,
						authenicated : true,
						profilePicture : profilePicture
					};
					
					cookieService.store('id', id, seconds);
					cookieService.store('token', token, seconds);
					cookieService.store('name', name, seconds);
					cookieService.store('profilePicture', profilePicture, seconds);

					$http.defaults.headers.common[name] = token;
				} else {
					reset();
				}		
			}, get : function() {
				if ($rootScope.userDetails === null) {
					id 		= cookieService.get('id');
					token 	= cookieService.get('token');
					name 	= cookieService.get('name');
					profilePicture 	= cookieService.get('profilePicture');
					if (id !== null && token !== null) {
						$rootScope.userDetails = {
							id : id,
							token : token,
							name : name,
							authenicated : true,
							profilePicture : profilePicture
						};
					}
					$http.defaults.headers.common[name] = token;
				}
				
		  		return $rootScope.userDetails;
			}, reset  : function() {
		   		$rootScope.userDetails = null;
		   		
		   		cookieService.remove('id');
				cookieService.remove('token');
				cookieService.remove('name');
				cookieService.remove('profilePicture');
			}
		};
		return handler;
	}
	service.$inject = ['$rootScope', '$http', 'cookieService'];

	return service;
});
