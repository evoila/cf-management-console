/**
 * DesignService
 **/

angular.module('services')
  .factory('DesignService', function DesignService() {

    var design = {
      stringColor: function(name) {
        function hashCode(str) { // java String#hashCode
          var hash = 0;
          for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
          }
          return hash;
        }

        function intToRGB(i) {
          var c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();

          return "00000".substring(0, 6 - c.length) + c;
        }
        return intToRGB(hashCode(name));
      },
      resolveServicePng: function(serviceName) {
        if (serviceName != undefined) {
          if (serviceName.indexOf("postgresql") > -1)
            return "postgresql";
          if (serviceName.indexOf("mongodb") > -1)
            return "mongodb";
          if (serviceName.indexOf("rabbitmq") > -1)
            return "rabbitmq";
          if (serviceName.indexOf("redis") > -1)
            return "redis";
        } else {
          return "notfound";
        }
      }
    };
    return design;

  });
