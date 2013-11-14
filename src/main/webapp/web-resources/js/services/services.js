/**
 * Services
 **/
define(['angular', 
	'services/general/clientCacheService',
	'services/general/cookieService',
	'services/general/localStorageService',
	'services/general/messageEmitter',
	'services/general/responseService',
	'services/general/uiContentService',
	'services/general/userDetailsService',

	'resource',
	'underscore',
	], function (angular, ClientCacheService, CookieService, LocalStorageService,
		MessageEmitter, ResponseService, UiContentService, UserDetailsService) {

	var services = angular.module('services', []);

	services.factory('clientCacheService', ClientCacheService);
	services.factory('cookieService', CookieService);
	services.factory('localStorageService', LocalStorageService);
	services.factory('messageEmitter', MessageEmitter);
	services.factory('responseService', ResponseService);
	services.factory('uiContentService', UiContentService)
	services.factory('userDetailsService', UserDetailsService);

});