angular.module('directives')
  .run(['$templateCache', function($templateCache) {
    $templateCache.put('partials/menu-single.tmpl.html',
      '<md-button ui-sref-active="active" \n' +
      '  ui-sref="{{section.state}}" ng-click="update(section.orga)">\n' +
      //'  ui-sref="{{section.state}}({organizationId:section.orga})" ng-click="update(section.orga)">\n' +
      '<i ng-class="{\'{{section.icon}}\' : true}" style="width:20px;"></i>'+
      '  {{section | humanizeDoc}}\n' +
      '  <span  class="md-visually-hidden "\n' +
      '    ng-if="isSelected()">\n' +
      '    current page\n' +
      '  </span>\n' +
      '</md-button>\n' +
      '');
  }])
  .directive('menuSingleItem', ['menu', function(menu) {
    return {
      scope: {
        section: '='
      },
      templateUrl: 'partials/menu-single.tmpl.html',
      link: function($scope, $element) {
        var controller = $element.parent().controller();

        $scope.update = function(orga) {
          // set flag to be used later when
          // $locationChangeSuccess calls openPage()
          controller.autoFocusContent = true;
          if (orga) {
            menu.organization = orga;
          }
        };
      }
    };
  }])
