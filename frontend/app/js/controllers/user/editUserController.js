angular.module('controllers')
  .controller('editUserController',
    function EditUserController($scope, $state, menu, Restangular, envService) {

      var self = this;
      $scope.prefix = envService.read('cf_prefix');

      $scope.init = function() {
        $scope.orgId = $state.params.organizationId;

        if($state.params.user != null) {
          $scope.orgName = menu.organization.entity.name;

          self.user = $state.params.user;
          self.user.isOrgBillingManager = checkIfOrgBillingManager();
          self.user.isOrgAuditor = checkIfOrgAuditor();
          checkIfSpaceManager();
          checkIfSpaceDeveloper();
          checkIfSpaceAuditor();
        }
        else {
          Restangular.one('organizations', $state.params.organizationId).get().then(function(org) {
            $scope.org = org;
            $scope.orgName = org.entity.name;
            var spacesUrl = $scope.org.entity.spaces_url.replace($scope.prefix, '');
            Restangular.one(spacesUrl).get().then(function(spaces) {
              $scope.spaces = spaces;
              prepareUser();
            })
          });
        }
      }

      function prepareUser() {
        Restangular.one('users', $scope.orgId).get().then(function(orgUsers) {
          var user = null;
          angular.forEach(orgUsers, function(orgUser, orgUserIndex) {
            if(orgUser.metadata.guid == $state.params.userId)
              user = orgUser
          });

          user.spaces = $scope.spaces;
          user.isOrgManager = false;
          user.entity.managed_organizations.forEach(function(org) {
            if(org.metadata.guid == $scope.orgId)
              user.isOrgManager = true;
          })

          user.billingManagedOrgs = user.entity.billing_managed_organizations;
          user.auditedOrgs = user.entity.audited_organizations;

          user.managedSpaces = user.entity.managed_spaces;
          user.auditedSpaces = user.entity.audited_spaces;

          self.user = user;
          self.user.isOrgBillingManager = checkIfOrgBillingManager();
          self.user.isOrgAuditor = checkIfOrgAuditor();
          checkIfSpaceManager();
          checkIfSpaceDeveloper();
          checkIfSpaceAuditor();

        }, function(response) {
            responseService.error(response);
        });
      }


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
        var managedOrgsUrl = self.user.entity.managed_organizations_url.replace($scope.prefix, '') + '/';
        if(self.user.isOrgManager)
          Restangular.one(managedOrgsUrl, $scope.orgId).customPUT(undefined, undefined,({ username: "dummy" }),undefined);
        else
          Restangular.one(managedOrgsUrl + $scope.orgId).remove();
      }
      $scope.switchOrgBillingManager = function() {
        var billingManagedOrgsUrl = self.user.entity.billing_managed_organizations_url.replace($scope.prefix, '') + '/';
        if(self.user.isOrgBillingManager)
          Restangular.one(billingManagedOrgsUrl, $scope.orgId).customPUT(undefined, undefined,({ username: "dummy" }),undefined);
        else {
          Restangular.one(billingManagedOrgsUrl + $scope.orgId).remove();
        }
      }
      $scope.switchOrgAuditor = function() {
        var auditedOrgsUrl = self.user.entity.audited_organizations_url.replace($scope.prefix, '') + '/';
        if(self.user.isOrgAuditor)
          Restangular.one(auditedOrgsUrl, $scope.orgId).customPUT(undefined, undefined,({ username: "dummy" }),undefined);
        else {
          Restangular.one(auditedOrgsUrl + $scope.orgId).remove();
        }
      }

      // switch space roles
      $scope.switchSpaceManager = function(space) {
        var managedSpacesUrl = self.user.entity.managed_spaces_url.replace($scope.prefix, '') + '/';
        if(space.userIsManager)
          Restangular.one(managedSpacesUrl, space.metadata.guid).customPUT(undefined, undefined,({ username: "dummy" }),undefined);
        else
            Restangular.one(managedSpacesUrl + space.metadata.guid).remove();
      }
      $scope.switchSpaceDeveloper = function(space) {
        var spacesUrl = self.user.entity.spaces_url.replace($scope.prefix, '') + '/';
        if(space.userIsDeveloper)
          Restangular.one(spacesUrl, space.metadata.guid).customPUT(undefined, undefined,({ username: "dummy" }),undefined);
        else
            Restangular.one(spacesUrl + space.metadata.guid).remove();
      }
      $scope.switchSpaceAuditor = function(space) {
        var auditedSpacesUrl = self.user.entity.audited_spaces_url.replace($scope.prefix, '') + '/';
        if(space.userIsAuditor)
          Restangular.one(auditedSpacesUrl, space.metadata.guid).customPUT(undefined, undefined,({ username: "dummy" }),undefined);
        else
            Restangular.one(auditedSpacesUrl + space.metadata.guid).remove();
      }

      $scope.loading = false;
  });
