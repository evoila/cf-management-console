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
          $state.go('login');
        }
      } else {
        Restangular.all('organizations').getList().then(function(data) {
          $scope.organizations = data;
          menu.organization = data[0];
          menu.orgsToMenu(data, function() {
              $scope.menu = menu;
          });
        }, function(response) {
          clientCacheService.clear;
          $state.go('login');
          $rootScope.isAuthenticated = false;
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
        $scope.appTitle = name;
      }

      function isOpen(section) {
        return menu.isSectionSelected(section);
      }

      function toggleOpen(section) {
        menu.toggleSelectSection(section);
      }
    });
