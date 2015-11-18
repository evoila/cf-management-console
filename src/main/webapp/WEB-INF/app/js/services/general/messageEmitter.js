/**
 * MessageEmitterService
 **/

angular.module('services')
  .factory('messageEmitter', function MessageEmitter($rootScope) {
    var alertChannel = 'alertChannel';

    var message = {};
    var messageEmitter = {
      message: function(msg) {
        message = {
          msg: msg
        }
        $rootScope.$broadcast(alertChannel, message);
      }
    };
    return messageEmitter;

  });
