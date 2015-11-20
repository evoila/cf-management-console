/**
 * HomeController
 **/

angular.module('controllers')
  .controller('homeController',
    function HomeController($scope, $mdSidenav, menu, authenticationService) {
      var vm = this;
      vm.isOpen = isOpen;
      vm.toggleOpen = toggleOpen;
      $scope.menu = menu;


      $scope.openMenu = function() {
        $mdSidenav('left').toggle();
      };

      $scope.logout = function() {
        authenticationService.logout();
      };

      function isOpen(section) {
        return menu.isSectionSelected(section);
      }

      function toggleOpen(section) {
        menu.toggleSelectSection(section);
      }
    });
