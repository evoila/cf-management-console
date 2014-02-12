/**
 * Services
 **/
define(['angular', 
	'services/general/clientCacheService',
	'services/general/cookieService',
	'services/general/localStorageService',
	'services/general/messageEmitter',
	'services/general/responseService',
	'services/general/userDetailsService',
	'underscore'
	], function (angular, ClientCacheService, CookieService, LocalStorageService,
		MessageEmitter, ResponseService, UserDetailsService) {

	var services = angular.module('services', []);

	services.factory('clientCacheService', ClientCacheService);
	services.factory('cookieService', CookieService);
	services.factory('localStorageService', LocalStorageService);
	services.factory('messageEmitter', MessageEmitter);
	services.factory('responseService', ResponseService);
	services.factory('userDetailsService', UserDetailsService);

});