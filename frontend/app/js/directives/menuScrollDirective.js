angular.module('directives')
  .run(['$templateCache', function($templateCache) {
    $templateCache.put('partials/menu-scroll.tmpl.html',
      '<md-button \n' +
      '  ng-click="doScroll(section.name)">\n' +
      '  {{section | humanizeDoc}}\n' +
      '</md-button>\n' +
      '');
  }])
  .directive('menuScroll', ['$rootScope', '$state', 'menu', function($rootScope, $state, menu) {
    return {
      scope: {
        section: '='
      },
      templateUrl: 'partials/menu-scroll.tmpl.html',
      link: function($scope, $element, $attrs) {
        var controller = $element.parent().controller();

        $scope.update = function(organization) {
          if(organization)
            menu.spacesToMenu(organization.metadata.guid)
        };

        $scope.doScroll = function(target) {
          if($state.is('space-list'))
            $rootScope.$broadcast('doScroll', { target: target });
          else {
            $state.go('space-list', $state.params);

          }
        }

      }
    }
  }])
