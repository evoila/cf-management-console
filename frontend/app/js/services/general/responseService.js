/**
 * ResponseService.js
 **/
angular.module('services')
  .factory('responseService', function responseService(messageEmitter, $state) {
    var response = {};
    response.success = function(response, message, redirect, params) {
      if (redirect) {
        if ($state.current && $state.current.name == redirect)
          $state.go(redirect, params, {reload:true});
        else
          $state.go(redirect, params);
      }

      messageEmitter.message(message);
    },
    response.error = function(response, message) {
      var sendMsg = null;
      if (!message) {
        try {
          var obj = JSON.parse(response.data.message);
          sendMsg = obj.message;
        }
        catch(err) {
          sendMsg = 'An undefined error occured';
        }
      } else {
        sendMsg = message;
      }
      messageEmitter.message(sendMsg);
    }
    return response;
});
