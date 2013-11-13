/**
 * Services
 **/
define(['angular', 
	'services/general/clientStorage',
	'services/general/cookieService',
	'services/general/localStorageService',
	'services/general/messageEmitter',
	'services/general/responseService',
	'services/general/uiContentService',
	'services/general/userDetailsService',

	'resource',
	'underscore',
	], function (angular, ClientStorage, CookieService, LocalStorageService,
		MessageEmitter, ResponseService, UiContentService, UserDetailsService) {

	var services = angular.module('services', []);

	services.factory('clientStorage', ClientStorage);
	services.factory('cookieService', CookieService);
	services.factory('localStorageService', LocalStorageService);
	services.factory('messageEmitter', MessageEmitter);
	services.factory('responseService', ResponseService);
	services.factory('uiContentService', UiContentService)
	services.factory('userDetailsService', UserDetailsService);

});