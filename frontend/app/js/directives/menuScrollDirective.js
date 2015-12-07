angular.module('directives')
  .run(['$templateCache', function($templateCache) {
    $templateCache.put('partials/menu-scroll.tmpl.html',
      '<md-button \n' +
      '  ng-click="doScroll(section.name, section.orga)">\n' +
      '  {{section | humanizeDoc}}\n' +
      '</md-button>\n' +
      '');
  }])
  .directive('menuScroll', ['$rootScope', '$document', 'menu', function($rootScope, $document, menu) {
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

        $scope.doScroll = function(target, id) {
          $rootScope.$broadcast('doScroll', { target: target });
        }

      }
    }
  }])
