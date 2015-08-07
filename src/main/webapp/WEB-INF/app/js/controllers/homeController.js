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
      vm.menu = menu;

      //$scope.organization = vm.menu.organization;

      vm.status = {
        isFirstOpen: true,
        isFirstDisabled: false
      };

      $rootScope.isAuthenticated = clientCacheService.isAuthenticated();
      console.debug($scope.isAuthenticated)
      if (!clientCacheService.isAuthenticated()) {
        if ($location.path() != '/login' && $location.path() != '/register') {
          $location.path('/login');
        }
      } else {
        Restangular.all('organizations').getList().then(function(data) {
          $scope.organizations = data;
          vm.menu.organization = data[0];

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
          /*$scope.$watch('organization', function(organization) {
            $state.go('app-spaces', {
              organizationId: organization.metadata.guid
            }, {
              reload: true
            });
          })*/
        });
      }

      /*Adds all organisations to the menu*/
      function orgsToSections(organizations) {
        console.log(organizations.length);
        vm.menu.organizations.name = 'Organisations ('+organizations.length+')';
        vm.menu.organizations.pages = [];
        angular.forEach (organizations, function(orga, key) {
            var page = {};
            page.name = orga.entity.name;
            page.type = 'link';
            page.state = 'app-spaces';
            page.params = {organizationId: orga.metadata.guid};
            page.orga = orga;
          vm.menu.organizations.pages.push(page);
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
