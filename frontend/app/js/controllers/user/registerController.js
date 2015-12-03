/**
 * RegisterController
 **/


angular.module('controllers')
  .controller('registerController',
    function RegisterController($scope, $state, $http, responseService, envService, Restangular) {
      $scope.state = $state;
      $scope.organizationValid = false;
      $scope.usernameExists = false;

      REST_API = envService.read('restApiUrl');


      $scope.checkOrgName = function(orgName) {
        Restangular.one('organization/' + orgName).get().then(function(data) {
          if(!data)
            $scope.organizationValid = true;
          else
            $scope.organizationValid = false;
        });
      };

      $scope.register = function(registerForm) {
        if(!$scope.organizationValid)
          alert('Todo: nice errors, warnings');

        else {
          Restangular.all('users').post(registerForm).then(function(user) {
            var createdUserId = user.metadata.guid;

            var organisationContent = {
              'name': registerForm.orgName,
              'user_guids': [createdUserId],
              'manager_guids': [createdUserId]
            };

            Restangular.all('organizations').post(organisationContent).then(function(organization) {
              responseService.success(organization, 'login');
            }, function(response) {
                responseService.error(response);
            });
          }, function(response) {
              responseService.error(response);
          });
        }
      };


    });
