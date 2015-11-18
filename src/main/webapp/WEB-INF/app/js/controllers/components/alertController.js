/**
 * AlertController
 **/

angular.module('controllers')
  .controller('alertController',
    function AlertController($scope, $rootScope, $mdToast) {

      var timeout = 3500;
      var alertChannel = "alertChannel";
      $scope.toastPosition = {
        bottom: true,
        top: false,
        left: false,
        right: true
      };

      $scope.getToastPosition = function() {
        return Object.keys($scope.toastPosition)
          .filter(function(pos) {
            return $scope.toastPosition[pos];
          })
          .join(' ');
      };

      $rootScope.$on(alertChannel, function(event, data) {
        $mdToast.show(
          $mdToast.simple()
          .content(data.msg)
          .position($scope.getToastPosition())
          .hideDelay(timeout)
        );
      });
    });
