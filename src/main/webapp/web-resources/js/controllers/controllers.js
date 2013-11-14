/**
 * Base Controller
 **/ 

define(['angular',
	'controllers/components/alertController',

	'controllers/app/appLogController',
	'controllers/app/appSettingsController',
	'controllers/app/appSpacesController',
	
	'controllers/general/deleteController',
	'controllers/general/marketPlaceController',
	'controllers/general/navigationController',
	
	'controllers/org/organisationController',
	'controllers/org/organisationUserController',
	
	'controllers/space/spaceController',
	
	'controllers/user/loginController',
	'controllers/user/registerController',
	'controllers/user/userInfoController',
	'controllers/user/usersController',

	'controllers/homeController'
	],
 	function (angular, AlertController,
 		AppLogController, AppSettingsController, AppSpacesController,
 		DeleteController,
 		MarketPlaceController, NavigationController,
 		OrganisationController, OrganisationUserController,
 		SpaceController,
 		LoginController, RegisterController, UserInfoController, UsersController,
 		HomeController) {

 		var controllers = angular.module('controllers', ['services']);

 		controllers.controller('alertController', AlertController);

 		controllers.controller('appLogController', AppLogController);
 		controllers.controller('appSettingsController', AppSettingsController);
 		controllers.controller('appSpacesController', AppSpacesController);

 		controllers.controller('deleteController', DeleteController);
 		
 		controllers.controller('marketPlaceController', MarketPlaceController);
 		controllers.controller('navigationController', NavigationController);
 		
 		controllers.controller('organisationController', OrganisationController);
 		controllers.controller('organisationUserController', OrganisationUserController);
 		
 		controllers.controller('spaceController', SpaceController);
 		
 		controllers.controller('loginController', LoginController);
 		controllers.controller('registerController', RegisterController);
 		controllers.controller('userInfoController', UserInfoController);
 		controllers.controller('usersController', UsersController);
 		
 		controllers.controller('homeController', HomeController);

 });