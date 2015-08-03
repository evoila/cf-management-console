/**
 * MessageEmitterService
 **/
 
define(['angular'], function (angular) {
	"use strict";

	var service = function($rootScope) {
		var alertChannel = 'alertChannel';

		var message = {};
		var messageEmitter = { 
			message : function(title, msg, type) {
			   	message = {
			    	title : title,
			    	msg : msg,
			    	type : type
					}
				$rootScope.$broadcast(alertChannel, message);  
			}
		};
		return messageEmitter;
	}
	service.$inject = ['$rootScope'];

	return service;
});
