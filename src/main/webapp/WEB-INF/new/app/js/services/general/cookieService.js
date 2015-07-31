/**
 * CookieService
 **/

angular.module('services')
  .factory('CookieService', function CookieService(localStorageService) {

    var cookie = {
      store: function(name, value, seconds) {
        var date, expires;

        if (seconds) {
          date = new Date();
          date.setTime(date.getTime() + (seconds * 1000));
          expires = ";expires=" + date.toGMTString();
        } else {
          expires = '';
        }
        document.cookie = name + "=" + value + expires + "; path=/";
      },
      get: function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');

        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
          }

          if (c.indexOf(nameEQ) == 0)
            return c.substring(nameEQ.length, c.length);
        }
        return null;
      },
      remove: function(name) {
        this.store(name, '', -1);
      }
    };
    return cookie;

  });
