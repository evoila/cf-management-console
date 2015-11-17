/**
 * HomeController
 **/

angular.module('controllers')
  .controller('homeController',
    function HomeController($scope, $state, Restangular, $location, $mdSidenav, $rootScope, clientCacheService, $mdSidenav, menu) {
      $scope.state = $state;

      var vm = this;

      vm.isOpen = isOpen;
      vm.toggleOpen = toggleOpen;
      vm.autoFocusContent = false;

      vm.status = {
        isFirstOpen: true,
        isFirstDisabled: false
      };



      $rootScope.isAuthenticated = clientCacheService.isAuthenticated();
      if (!clientCacheService.isAuthenticated()) {
        if ($location.path() != '/login' && $location.path() != '/register') {
          $location.path('/login');
        }
      } else {
        Restangular.all('organizations').getList().then(function(data) {
          $scope.organizations = data;
          menu.organization = data[0];
          menu.orgsToMenu(data);
          $state.go('spaces', {
            organizationId: data[0].metadata.guid
          })
        }, function(response) {
          clientCacheService.clear;
          $location.path('/login');
          $rootScope.isAuthenticated = false;
        }).then(function() {
          $scope.menu = menu;
        });

      }


      $scope.logout = function() {
        $rootScope.isAuthenticated = false;
        clientCacheService.logout();
        $state.go('login', {}, {
          reload: true
        });
      };

      $scope.openMenu = function() {
        $mdSidenav('left').toggle();
      };

      $scope.updateTitle = function(name) {
        console.debug('homeController: '+name);
        $scope.appTitle = name;
      }

      function isOpen(section) {
        return menu.isSectionSelected(section);
      }

      function toggleOpen(section) {
        menu.toggleSelectSection(section);
      }
    });
