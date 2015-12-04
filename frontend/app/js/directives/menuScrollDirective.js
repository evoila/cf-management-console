angular.module('directives')
  .run(['$templateCache', function($templateCache) {
    $templateCache.put('partials/menu-scroll.tmpl.html',
      '<md-button \n' +
      '  ng-click="test">\n' +
      '  {{section | humanizeDoc}}\n' +
      '</md-button>\n' +
      '');
  }])
  .directive('menuScroll', ['menu', function(menu) {
    return {
      scope: {
        section: '='
      },
      templateUrl: 'partials/menu-scroll.tmpl.html',
      link: function($scope, $element, $attrs) {
        var controller = $element.parent().controller();

        $scope.test = 'doScroll(anc-' + $attrs.target + ')';

        $scope.update = function(organization) {
          if(organization)
            menu.spacesToMenu(organization.metadata.guid)
        };
      }
    }
  }])
