angular.module('controllers')
  .controller('servicesController',
    function ServicesController($scope, $state, menu, Restangular) {

    $scope.loading = true;

    var self = this;
    self.service = $state.params.service;
    

    $scope.loading = false;
  });
