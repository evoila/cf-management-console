angular.module('cf-management-console', ['ngMaterial', 'controllers', 'routes',
  'ngMdIcons', 'ngClipboard', 'restangular'])
  .config(function(ngClipProvider, $mdThemingProvider, $mdIconProvider, RestangularProvider, REST_API) {
    ngClipProvider.setPath("bower_components/zeroclipboard/dist/ZeroClipboard.swf");
  //  RestangularProvider.setBaseUrl('http://127.0.0.1:8080/bbb-admin-core/');
    RestangularProvider.setDefaultHeaders({
      "Content-Type" : "application/json;charset=UTF-8",
      "Accept" :"application/json;charset=UTF-8" });
    RestangularProvider.setBaseUrl(REST_API);


    $mdThemingProvider.definePalette('amazingPaletteName', {
      '50': 'ae2225',
      '100': 'ffcdd2',
      '200': 'ef9a9a',
      '300': 'e57373',
      '400': '467fd3', //lightblue
      '500': '2b5086', //blue
      '600': 'ae2225', //red
      '700': 'ae2225', //red when buttons are klicked
      '800': 'c62828',
      '900': 'b71c1c',
      'A100': 'ff8a80',
      'A200': 'ff5252',
      'A400': 'ff1744',
      'A700': '78a3e1', // lighter blue
      'contrastDefaultColor': 'light', // whether, by default, text (contrast)
      // on this palette should be dark or light
      'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
        '200', '300', '400', 'A100'
      ],
      'contrastLightColors': undefined // could also specify this if default was 'dark'
    });

    $mdThemingProvider.theme('default')
      .primaryPalette('amazingPaletteName', {
        'default': '500'
      })
      .warnPalette('amazingPaletteName', {
        'default': '600'
      })
      .accentPalette('amazingPaletteName', {
        'default': '400'
      });

    $mdIconProvider
      .defaultIconSet("./../assets/svg/avatars.svg", 128)
      .icon("menu", "./../assets/svg/menu.svg", 24)
      .icon("info", "./../assets/svg/info.svg", 24)
      .icon("create", "./../assets/svg/create.svg", 24)
      .icon("share", "./../assets/svg/share.svg", 24)
      .icon("google_plus", "./..assets/svg/google_plus.svg", 512)
      .icon("hangouts", "./../assets/svg/hangouts.svg", 512)
      .icon("twitter", "./../assets/svg/twitter.svg", 512)
      .icon("phone", "./..assets/svg/phone.svg", 512);

  }).constant('REST_API', 'http://localhost:8080/cfmc/api')
  .run(function($rootScope, $http, clientCacheService) {
    $rootScope.forceLogin = function(status) {
      if(status === 401) {
        clientCacheService.logout();
        $state.go('/login');
      }
    };

    if (clientCacheService.getUser() != null) {
      var token = clientCacheService.getUser().accessToken;

      $http.defaults.headers.common['Authorization'] = 'bearer ' + token;
    } else
      $rootScope.forceLogin();
  });
