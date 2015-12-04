angular.module('directives')
  .run(['$templateCache', function($templateCache) {
    $templateCache.put('partials/menu-scroll.tmpl.html',
      '<md-button \n' +
      '  ng-click="doScroll()">\n' +
      '</md-button>\n' +
      '');
  }])
  .directive('menuScroll', ['menu', function(menu) {
    return {
      scope: {
        section: '='
      },
      templateUrl: 'partials/menu-scroll.tmpl.html',
      link: function($scope, $element) {
        var controller = $element.parent().controller();

        $scope.update = function(organization) {
          if(organization)
            menu.spacesToMenu(organization.metadata.guid)
        };
      }
    }
  }])
