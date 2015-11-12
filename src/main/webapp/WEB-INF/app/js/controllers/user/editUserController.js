angular.module('controllers')
  .controller('editUserController',
    function EditUserController($scope, $state, menu, Restangular) {

    $scope.orgId = menu.organization.metadata.guid;
    $scope.loading = true;

    var self = this;
    self.user = $state.params.user;
    self.user.isOrgManager = checkIfOrgManager();
    self.user.isOrgBillingManager = checkIfOrgBillingManager();
    self.user.isOrgAuditor = checkIfOrgAuditor();


    // check org roles
    function checkIfOrgManager() {
      var isOrgManager = false;
      self.user.managedOrgs.forEach(function(org) {
        if(org.metadata.guid == $scope.orgId)
          isOrgManager = true;
      })
      return isOrgManager;
    }

    function checkIfOrgBillingManager() {
      var isOrgBillingManager = false;
      self.user.billingManagedOrgs.forEach(function(org) {
        if(org.metadata.guid == $scope.orgId)
          isOrgBillingManager = true;
      })
      return isOrgBillingManager;
    }

    function checkIfOrgAuditor() {
      var isOrgAuditor = false;
      self.user.auditedOrgs.forEach(function(org) {
        if(org.metadata.guid == $scope.orgId)
          isOrgAuditor = true;
      })
      return isOrgAuditor;
    }


    // switch org roles
    $scope.switchOrgManager = function() {
      var managedOrgsUrl = self.user.entity.managed_organizations_url.replace('/v2', '') + '/';
      if(self.user.isOrgManager)
        Restangular.one(managedOrgsUrl, $scope.orgId).customPUT(undefined, undefined,({ username: "dummy" }),undefined);
      else
        Restangular.one(managedOrgsUrl + $scope.orgId).remove();
    }
    $scope.switchOrgBillingManager = function() {
      var billingManagedOrgsUrl = self.user.entity.billing_managed_organizations_url.replace('/v2', '') + '/';
      if(self.user.isOrgBillingManager)
        Restangular.one(billingManagedOrgsUrl, $scope.orgId).customPUT(undefined, undefined,({ username: "dummy" }),undefined);
      else {
        Restangular.one(billingManagedOrgsUrl + $scope.orgId).remove();
      }
    }
    $scope.switchOrgAuditor = function() {
      var auditedOrgsUrl = self.user.entity.audited_organizations_url.replace('/v2', '') + '/';
      if(self.user.isOrgAuditor)
        Restangular.one(auditedOrgsUrl, $scope.orgId).customPUT(undefined, undefined,({ username: "dummy" }),undefined);
      else {
        Restangular.one(auditedOrgsUrl + $scope.orgId).remove();
      }
    }




    // check spaces roles

    // apply to switches



    $scope.loading = false;
});
