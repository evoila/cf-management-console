/**
 * DesignService
 **/

angular.module('services')
  .factory('DesignService', function DesignService() {

    var design = {
      getNumberOfVisuallyDistinctColors: function(number) {
        var colors = [
          '#e53939', '#8c2323', '#330d0d', '#cc6666', '#997373', '#ff2200', '#4c0a00', '#4c2b26', '#a62c00',
          '#f29979', '#ffd0bf', '#e55c00', '#401a00', '#8c6246', '#4c3626', '#ff8800', '#8c4b00', '#4c2900',
          '#f2ba79', '#e6cbac', '#998773', '#e5ac39', '#4c3d00', '#8c7723', '#e5cf73', '#cad900', '#3e4020',
          '#c9cc99', '#669900', '#334d00', '#bfe673', '#778c69', '#c8ffbf', '#00f200', '#00e600', '#00d900',
          '#00b300', '#263328', '#1d7334', '#2d5939', '#39e695', '#bfffe1', '#00b38f', '#20806c', '#3df2e6',
          '#00b3bf', '#13494d', '#86b0b3', '#00b8e6', '#00708c', '#005e8c', '#002233', '#bfeaff', '#0074d9',
          '#738799', '#262d33', '#001a40', '#73a1e6', '#2d3e59', '#0033bf', '#001b66', '#4073ff', '#264599',
          '#606480', '#7340ff', '#392d59', '#38008c', '#aa79f2', '#a38fbf', '#220040', '#69238c', '#f2bfff',
          '#b300bf', '#ea79f2', '#73005c', '#330029', '#4d2645', '#f200a2', '#d96cb5', '#8c6981', '#992654',
          '#33262b', '#f23d6d', '#661a2e', '#f2b6c6', '#664d53'
        ];
        for(var j, x, i = colors.length; i; j = Math.floor(Math.random() * i), x = colors[--i], colors[i] = colors[j], colors[j] = x);
        return colors.slice(1, number+1);
      },
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
        if (name) {
          return intToRGB(hashCode(name));
        } else {
          return null;
        }
      },
      resolveServicePng: function(serviceName) {
        if (serviceName != undefined) {
          if (serviceName.indexOf("postgre") > -1)
            return "postgresql";
          if (serviceName.indexOf("mongo") > -1)
            return "mongodb";
          if (serviceName.indexOf("rabbit") > -1)
            return "rabbitmq";
          if (serviceName.indexOf("redis") > -1)
            return "redis";
          if (serviceName.indexOf("elasticse") > -1)
            return "elasticsearch";
          if (serviceName.indexOf("mysql") > -1)
            return "mysql";
          if (serviceName.indexOf("logstash") > -1)
            return "logstash";
        } else {
          return "notfound";
        }
      }
    };
    return design;

  });
