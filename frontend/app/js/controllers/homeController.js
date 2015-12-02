/**
 * HomeController
 **/

angular.module('controllers')
  .controller('homeController',
    function HomeController($scope, $rootScope, $mdSidenav, menu, authenticationService) {
      var vm = this;
      vm.isOpen = isOpen;
      vm.toggleOpen = toggleOpen;
      $scope.menu = menu;


      $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams) {
          $mdSidenav('left').close();
          $rootScope.lastPageChange = new Date().getTime();
          if (!authenticationService.isAuthenticated()) {
            authenticationService.logout();
          }
      });

      $scope.openMenu = function() {
        $mdSidenav('left').toggle();
      };

      $scope.logout = function() {
        $rootScope.hideLoginForm = false;
        authenticationService.logout();
      };

      function isOpen(section) {
        return menu.isSectionSelected(section);
      }

      function toggleOpen(section) {
        menu.toggleSelectSection(section);
      }
    });
