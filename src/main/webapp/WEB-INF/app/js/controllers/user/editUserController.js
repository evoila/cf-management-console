angular.module('controllers')
  .controller('editUserController',
    function EditUserController($scope, $state, menu, Restangular) {

    $scope.orgId = menu.organization.metadata.guid;
    $scope.orgName = menu.organization.entity.name;
    $scope.loading = true;

    var self = this;
    self.user = $state.params.user;
    self.user.isOrgBillingManager = checkIfOrgBillingManager();
    self.user.isOrgAuditor = checkIfOrgAuditor();
    checkIfSpaceManager();
    checkIfSpaceDeveloper();
    checkIfSpaceAuditor();


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


    // check spaces roles
    function checkIfSpaceManager() {
      self.user.spaces.forEach(function(space) {
        space.entity.managers.forEach(function(manager) {
          space.userIsManager = false;
          if(manager.metadata.guid == self.user.metadata.guid)
            space.userIsManager = true;
        })
      })
    }

    function checkIfSpaceDeveloper() {
      self.user.spaces.forEach(function(space) {
        space.entity.developers.forEach(function(dev) {
          space.userIsDeveloper = false;
          if(dev.metadata.guid == self.user.metadata.guid)
            space.userIsDeveloper = true;
        })
      })
    }

    function checkIfSpaceAuditor() {
      self.user.spaces.forEach(function(space) {
        space.entity.auditors.forEach(function(auditor) {
          space.userIsAuditor = false;
          if(auditor.metadata.guid == self.user.metadata.guid)
            space.userIsAuditor = true;
        })
      })
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

    // switch space roles
    $scope.switchSpaceManager = function(space) {
      var managedSpacesUrl = self.user.entity.managed_spaces_url.replace('/v2', '') + '/';
      if(space.userIsManager)
        Restangular.one(managedSpacesUrl, space.metadata.guid).customPUT(undefined, undefined,({ username: "dummy" }),undefined);
      else
          Restangular.one(managedSpacesUrl + space.metadata.guid).remove();
    }











    $scope.loading = false;
});
