/**
 * RegisterController
 **/


angular.module('controllers')
  .controller('registerController',
    function RegisterController($scope, $state, $http, responseService, envService, Restangular) {
      $scope.state = $state;
      $scope.organizationValid = false;

      REST_API = envService.read('restApiUrl');


      $scope.checkOrgName = function(orgName) {
        Restangular.one('organization/' + orgName).get().then(function(data) {
          if(!data == true)
            $scope.organizationValid = true;
          else
            $scope.organizationValid = false;
        })
      };

      $scope.register = function(registerForm) {
        $scope.loading = true;

        Restangular.one('users').customPOST(undefined, undefined,({  username: registerForm.email, firstName: registerForm.firstname, lastName: registerForm.lastname, password: registerForm.password}),undefined).then(function(user) {
          var createdUserId = user.metadata.guid;

          var organisationContent = {
            'name': registerForm.orgName,
            'user_guids': [createdUserId],
            'manager_guids': [createdUserId]
          };

          Restangular.all('organizations').post(organisationContent).then(function(organization) {
            responseService.executeSuccess(user, null, 'login');

          }, function(response) {
              $scope.loading = false;
              responseService.executeError(response, null, null, $scope, 'organization');
          });

        }, function(response) {
            $scope.loading = false;
            if(response.data.message.indexOf('409 Conflict') > -1)
              alert('Username already exists')
            else
              responseService.executeError(response, null, null, $scope, 'user');
        });
      };


    });
