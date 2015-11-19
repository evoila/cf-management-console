angular.module('directives')
  .run(['$templateCache', function($templateCache) {
    $templateCache.put('partials/menu-link.tmpl.html',
      '<md-button ui-sref-active="active" \n' +
      '  ui-sref="{{section.state}}({{section.params}})" ng-click="update(section.orga)">\n' +
      '<i ng-class="{\'{{section.icon}}\' : true}" style="width:20px;"></i>'+
      '  {{section | humanizeDoc}}\n' +
      '  <span  class="md-visually-hidden "\n' +
      '    ng-if="isSelected()">\n' +
      '    current page\n' +
      '  </span>\n' +
      '</md-button>\n' +
      '');
  }])
  .directive('menuLink', ['menu', function(menu) {
    return {
      scope: {
        section: '='
      },
      templateUrl: 'partials/menu-link.tmpl.html',
      link: function($scope, $element) {
        var controller = $element.parent().controller();

        $scope.update = function(organization) {
          if(organization)
            menu.spacesToMenu(organization.metadata.guid)
        };
      }
    };
  }])
