/**
 * LoginController
 **/


angular.module('controllers')
  .controller('loginController',
    function LoginController($scope, $state, $rootScope, authenticationService) {

      $scope.hideForm = $rootScope.hideLoginForm;

      $scope.login = function(userForm) {
        var user = {};
        user.username = userForm.email;
        user.password = userForm.password;

        authenticationService.login(user);
      };

      return LoginController;
    });
