/**
 * HomeController
 **/

angular.module('controllers')
  .controller('homeController',
    function HomeController($scope, $state, Restangular, $location, $mdSidenav, $rootScope, clientCacheService, $mdSidenav, menu) {
      $scope.state = $state;

      var vm = this;

      $rootScope.isAuthenticated = clientCacheService.isAuthenticated();
      console.debug($scope.isAuthenticated)
      if (!clientCacheService.isAuthenticated()) {
        if ($location.path() != '/login' && $location.path() != '/register') {
          $location.path('/login');
        }
      } else {
        Restangular.all('organizations').getList().then(function(data) {
          $scope.organizations = data;
          //vm.menu.sections[0].pages = data;
          $scope.organization = data[0];
          console.debug(data);
          orgsToSections(data);
          $state.go('app-spaces', {
            organizationId: data[0].metadata.guid
          })
        }, function(response) {
          clientCacheService.clear;
          $location.path('/login');
          $rootScope.isAuthenticated = false;
        }).then(function() {
          $scope.$watch('organization', function(organization) {
            $state.go('app-spaces', {
              organizationId: organization.metadata.guid
            }, {
              reload: true
            });
          })
        });
      }

      function orgsToSections(organizations) {
        angular.forEach (organizations, function(orga, key) {
          if (vm.menu.sections[0].pages == undefined)
            vm.menu.sections[0].pages = [];
            var page = {};
            page.name = orga.entity.name;
            page.type = 'link';
            page.state = 'app-spaces';
            page.params = {organizationId: orga.metadata.guid};
          vm.menu.sections[0].pages.push(page);
          console.log(orga.metadata.guid);
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

      vm.isOpen = isOpen;
      vm.toggleOpen = toggleOpen;
      vm.autoFocusContent = false;
      vm.menu = menu;

      vm.status = {
        isFirstOpen: true,
        isFirstDisabled: false
      };


      function isOpen(section) {
        return menu.isSectionSelected(section);
      }

      function toggleOpen(section) {
        menu.toggleSelectSection(section);
      }
    });
