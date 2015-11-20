/**
 * LoginController
 **/


angular.module('controllers')
  .controller('loginController',
    function LoginController($scope, authenticationService) {

      $scope.login = function(userForm) {
        var user = {};
        user.username = userForm.email;
        user.password = userForm.password;

        authenticationService.login(user);
      };

      return LoginController;
    });
