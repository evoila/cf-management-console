/**
 * ResponseService.js
 **/
angular.module('services')
  .factory('responseService', function ResponseService(messageEmitter, $location) {
    var response = {
      extractObject: function(entity) {
        var result = {},
          t, parts, part;
        for (var k in entity) {
          t = result;
          parts = k.split('.');
          var key = parts.pop()

          while (parts.length) {
            var arrayRegexp = /^\w+\[\d+\]$/g;
            var arrayIndexRegexp = /\[\d+\]$/g;
            var arrayExtractIndexRegexp = /\d+/g;
            var arrayNameRegexp = /^\w+/g;

            part = parts.shift();
            if (arrayRegexp.test(part)) {
              var val1 = arrayIndexRegexp.exec(part);
              var val = arrayExtractIndexRegexp.exec(val1);
              var index = parseInt(val);
              var arrayName = arrayNameRegexp.exec(part);
              t[arrayName] = t[arrayName] || [];
              t[arrayName][index] = t[arrayName][index] || {};
              t = t[arrayName][index];
            } else {
              t[part] = t[part] || {};
              t = t[part];
            }
          }

          t[key] = entity[k];
        }
        return result;
      },
      executeSuccess: function(response, getResponseHeaders, redirect) {
        if (redirect)
          $location.path(redirect);
        messageEmitter.message('Success', 'Please check the message below!', 'success');
      },
      executeError: function(response, getResponseHeaders, $scope, entity) {
        if (response.status === 400) {
          var parsedResponse = this.extractObject(response.data)
          $scope.errors = parsedResponse;
          messageEmitter.message('Warn', 'Validation Error!', 'warning');
        } else {
          messageEmitter.message('Error', 'Undefined error occurred!', 'danger');
        }
      },
      executeErrorWrapper: function(data, status, headers, scope, entity) {
        var headers = headers();
        var response = {
          data: data,
          status: status
        };
        this.executeError(response, headers, scope, entity);
      }
    };
    return response;

  });
