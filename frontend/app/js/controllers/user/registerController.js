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
          if(!data)
            $scope.organizationValid = true;
          else
            $scope.organizationValid = false;
        });
      };

      $scope.register = function(form) {

        var usr = {
          username: form.username,
          firstname: form.firstname,
          lastname: form.lastname,
          password: form.password
        }

        Restangular.all('users').post(usr).then(function(user) {
          var createdUserId = user.metadata.guid;

          var organizationContent = {
            'name': form.orgName,
            'user_guids': [createdUserId],
            'manager_guids': [createdUserId]
          };

          Restangular.all('organizations').post(organizationContent).then(function(organization) {
            responseService.success(organization, 'Your account has been created', 'login');
          }, function(response) {
              console.log(response)
              responseService.error(response);
          });
        }, function(response) {
          if(response.status == '409')
            $scope.nameInUse = true;
        });
      };


    });
