angular.module('cf-management-console', ['ngMaterial', 'md.data.table', 'controllers', 'directives' ,'services', 'routes',
    'ngMdIcons', 'ngClipboard', 'restangular','ngAnimate', 'environment','angular-loading-bar'
  ])
  .config(function(ngClipProvider, $mdThemingProvider, $mdIconProvider, envServiceProvider) {

    envServiceProvider.config({
        domains: {
            development: ['localhost', '127.0.0.1'],
            production: ['cfmc.88.198.249.62.xip.io']
        },
        vars: {
            development: {
                restApiUrl: 'http://localhost:8080/cfmc/api'
            },
            production: {
                restApiUrl: 'https://cfmc.88.198.249.62.xip.io/api'
            }
        }
    });
    envServiceProvider.check();
    ngClipProvider.setPath("bower_components/zeroclipboard/dist/ZeroClipboard.swf");

    $mdThemingProvider.definePalette('amazingPaletteName', {
      '50': 'ae2225',
      '100': 'ffcdd2',
      '200': 'ef9a9a',
      '300': 'e57373',
      '400': '467fd3',
      '500': '2b5086',
      '600': 'ae2225',
      '700': 'ae2225',
      '800': 'c62828',
      '900': 'b71c1c',
      'A100': 'ff8a80',
      'A200': 'ff5252',
      'A400': 'ff1744',
      'A700': '78a3e1',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': ['50', '100',
        '200', '300', '400', 'A100'
      ],
      'contrastLightColors': undefined
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

  })
  .run(function($rootScope, $state, $http, clientCacheService, Restangular, envService) {    
    Restangular.setBaseUrl(envService.read('restApiUrl'))
    .setDefaultHeaders({
      "Content-Type": "application/json;charset=UTF-8",
      "Accept": "application/json;charset=UTF-8",
    })
    .setErrorInterceptor(function(response, deferred, responseHandler) {
      if([401,403].indexOf(response.status) != -1) {
        logout();

        return false;
      }
      return true;
    })

    if (clientCacheService.getUser() != null) {
      var token = clientCacheService.getUser().accessToken;
      $http.defaults.headers.common['Authorization'] = 'bearer ' + token;
    } else {
      logout();
    }

    function logout() {
      clientCacheService.logout();
      $state.go('login');
    }
  });
