/**
 * DomainController
 **/

angular.module('controllers')
  .controller('domainController',
    function DomainController($scope, $state, Restangular, menu, clientCacheService, responseService, $mdDialog, $location) {
      console.log('domain controller');

      $scope.orgId = $state.params.organizationId;

      Restangular.one('private_domains', $scope.orgId).getList().then(function(domains) {
        $scope.domains = domains;
      });

      /*
       *  Dialog for
       *
       *  Create new user
       *
       */
      $scope.showCreateDomainDialog = function(ev) {
        $mdDialog.show({
          controller: DomainController,
          templateUrl: 'partials/domain/domain-create-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false
        })
      };

      $scope.submitCreateDomainForm = function(form) {
        var domain = {
          'name': form.name,
          'owning_organization_guid': $scope.orgId
        };

        Restangular.all('private_domains').post(domain).then(function(domain) {
          //responseService.success(domain, 'Domain was created successfully', 'domains', { organizationId : $scope.orgId });
        }, function(response) {
            responseService.error(response);
        });
        $mdDialog.hide();
      };

      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };




      /*
       *  Dialog for
       *
       *  Confirm delete domain
       *
       */
       $scope.showConfirm = function(ev, domain) {
        var confirm = $mdDialog.confirm()
              .title('Really delete domain?')
              .content(domain.entity.name)
              .ariaLabel('Confirm delete')
              .targetEvent(ev)
              .ok('Yes')
              .cancel('Better not');
        $mdDialog.show(confirm).then(function() {
          deleteDomain(domain);
        }, function() {

        });
      };

      function deleteDomain(domain) {
        Restangular.one('private_domains', domain.metadata.guid).remove().then(function() {

        })
      }



    });
