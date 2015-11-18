/**
 * ResponseService.js
 **/
angular.module('services')
  .factory('responseService', function responseService(messageEmitter, $state) {
    var response = {};
    response.success = function(response, message, redirect, params) {
      if (redirect)
        $state.go(redirect, params);
      messageEmitter.message(message);
    },
    response.error = function(response, message) {
      var sendMsg = null;
      if (!message) {
          var obj = JSON.parse(response.data.message);
          sendMsg = obj.message;
      } else {
        sendMsg = message;
      }
      messageEmitter.message(sendMsg);
    }
    return response;
});
