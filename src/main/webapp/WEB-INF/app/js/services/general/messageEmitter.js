/**
 * MessageEmitterService
 **/

angular.module('services')
  .factory('messageEmitter', function MessageEmitter($rootScope) {

    var alertChannel = 'alertChannel';

    var message = {};
    var messageEmitter = {
      message: function(title, msg, type) {
        message = {
          title: title,
          msg: msg,
          type: type
        }
        $rootScope.$broadcast(alertChannel, message);
      }
    };
    return messageEmitter;

  });
