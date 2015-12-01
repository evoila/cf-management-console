angular.module('directives')
  .directive('printJson', ['envService', function(envService) {
    return {
      replace: true,
      restrict: 'A',
      scope: {
        obj: '=',
        content: '='
      },
      template:
        '<div flex="100">' +
          '<md-content layout="column">' +
            '<md-card>' +
              '<md-card-content>' +
                '<pre>{{ obj | json }}</pre>' +
              '</md-card-content>' +
            '</md-card>' +
          '</md-content>' +
        '</div>',
      link: function(scope, element, attrs) {
        if(envService.get() == 'production')
          element.replaceWith('');
        }
      }
  }])
