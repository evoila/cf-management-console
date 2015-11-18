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
      $scope.menu = menu;

      $rootScope.isAuthenticated = clientCacheService.isAuthenticated();
      if (!clientCacheService.isAuthenticated()) {
        if ($location.path() != '/login' && $location.path() != '/register') {
          $state.go('login');
        }
      } else {
        menu.initMenu(function(organization) {
            if ($state.current.name == 'login')
                $state.go('spaces', { organizationId : organization.metadata.guid });
            else
              $state.go($state.current.name, $state.params);          

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

      function isOpen(section) {
        return menu.isSectionSelected(section);
      }

      function toggleOpen(section) {
        menu.toggleSelectSection(section);
      }
    });
