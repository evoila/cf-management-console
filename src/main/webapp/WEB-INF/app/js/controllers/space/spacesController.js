/**
 * AppSpacesController
 **/

angular.module('controllers')
  .controller('spacesController',
    function SpacesController($scope, $state, $location, $mdDialog, Restangular, responseService, menu, DesignService) {
      console.log('SpacesController');
      
      $scope.state = $state;
      $scope.loading = true;
      $scope.organizationId = $state.params.organizationId;
      $scope.appSpace = null;
      $scope.isOpen = false;
      $scope.demo = {
        isOpen: false,
        count: 0,
        selectedAlignment: 'md-left'
      };


      Restangular.one('organizations', $scope.organizationId).all('spaces').getList().then(function(data) {
        if (data[0] != undefined) {
          $scope.space = {
            selected: data[0].entity.name
          };
          $scope.appSpace = data[0].entity;
          data[0].entity.selected = true;
        }
        menu.spacesToMenu($scope.organizationId, data);
        $scope.spaces = data;
        $scope.loading = false;



        angular.forEach($scope.spaces, function(space) {
          space.count = 0;
          angular.forEach(space.entity.apps, function(app) {
            if (app.entity.state == "STARTED") {
              space.count++;
            }
          });
        });
      });



      $scope.colorString = function(name) {
        var myColor = DesignService.stringColor(name);
        return myColor;
      };

      $scope.servicePng = function(name) {
        var myService = DesignService.resolveServicePng(name);
        return myService;
      };

      $scope.startApplication = function(applicationId) {
        Restangular.all('applications').customPUT(applicationId, null, null, {
          'state': 'STARTED'
        }).then(function(data) {
          responseService.executeSuccess(data, data.headers, null);
          angular.forEach($scope.spaces, function(space, spaceIndex) {
            if (space.selected) {
              var index = -1;
              angular.forEach(space.applications, function(app, appIndex) {
                if (app.id == applicationId) {
                  index = appIndex;
                }
              });
              if (index > -1) {
                space.applications[index] = data;
              }
            }
          });
        });
      };

      $scope.stopApplication = function(applicationId) {
        Restangular.all('applications').customPUT(applicationId, null, null, {
          'state': 'STOPPED'
        }).then(function(data) {
          responseService.executeSuccess(data, data.headers, null);
          angular.forEach($scope.spaces, function(space, spaceIndex) {
            if (space.selected) {
              var index = -1;
              angular.forEach(space.applications, function(app, appIndex) {
                if (app.id == applicationId) {
                  index = appIndex;
                }
              });
              if (index > -1) {
                space.applications[index] = data;
              }
            }
          });
        });
      };

      $scope.selectSpace = function(spaceName) {
        $scope.space.selected = spaceName;
      };

      $scope.showServicesDialog = function(ev, appSpace) {
        var appsDialog = {
          parent: angular.element(document.body),
          ariaLabel: 'Services',
          template: '<md-dialog aria-label="List dialog">' +
            ' <md-dialog-content>' +
            '   <h2>Services</h2>' +
            '   <div flex layout="row">' +
            '     <div flex="35" layout="column">' +
            '       <div flex>' +
            '         <h3 class="Tab">Name</h3>' +
            '       </div>' +
            '       <div flex ng-repeat="service in service_instances">' +
            '         <p class="Tab">{{service.entity.name}}</p>' +
            '       </div>' +
            '     </div>' +
            '     <div flex="35" layout="column">' +
            '       <div flex="50">' +
            '         <h3 class="Tab">Service</h3>' +
            '       </div>' +
            '       <div flex=50 ng-repeat="service in service_instances">' +
            '         <p class="Tab">{{service.entity.service_plan.service.provider}} {{service.entity.service_plan.service.name}} {{service.entity.service_plan.service.version}}</p>' +
            '       </div>' +
            '     </div>' +
            '     <div flex="35" layout="column">' +
            '       <div flex="50">' +
            '         <h3 class="Tab">Plan Level</h3>' +
            '       </div>' +
            '       <div flex=50 ng-repeat="service in service_instances">' +
            '         <p class="Tab">{{service.entity.service_plan.entity.name}}</p>' +
            '       </div>' +
            '     </div>' +
            '     <div flex="35" layout="column">' +
            '       <div flex="50">' +
            '         <h3 class="Tab">Bound Apps</h3>' +
            '       </div>' +
            '        <div flex=50 ng-repeat="service in service_instances">' +
            '         <p class="Tab">{{service.entity.service_bindings.length}}</p>' +
            '       </div>' +
            '     </div>' +
            '     <div flex="35" layout="column">' +
            '       <div flex="50">' +
            '         <h3 class="Tab">Free</h3>' +
            '       </div>' +
            '       <div flex=50 ng-repeat="service in service_instances">' +
            '         <p class="Tab">{{service.entity.service_plan.entity.public}}</p>' +
            '       </div>' +
            '     </div>' +
            '   </div>' +
            '   <md-button class="md-fab md-fab-detail md-primary" aria-label="add">' +
            '     <md-tooltip>Add Service</md-tooltip>' +
            '     <ng-md-icon icon="add" size="40" style="fill:white"></ng-md-icon>' +
            '   </md-button>' +
            ' </md-dialog-content>' +
            ' <div class="md-actions">' +
            '   <md-button ng-click="hide()" class="md-primary">Close</md-button>' +
            ' </div>' +
            '</md-dialog>',
          locals: {
            appSpace: appSpace
          },
          controller: DialogController
        };
        $mdDialog.show(appsDialog);
      };

      $scope.showAppsDialog = function(ev, appSpace) {
        var appsDialog = {
          parent: angular.element(document.body),
          ariaLabel: 'Apps',
          template: '<md-dialog aria-label="List dialog">' +
            ' <md-dialog-content>' +
            '   <p>Select App for details</p>' +
            '   <md-select layout-align="center center" ng-model="app" aria-label="selectedApp" placeholder="Select App">' +
            '     <md-option ng-click="goToAppSettings(app)" ng-repeat="app in apps" ng-value="app">{{app.entity.name}}</md-option>' +
            '   </md-select>' +
            ' </md-dialog-content>' +
            ' <div class="md-actions">' +
            '   <md-button ng-click="hide()" class="md-primary">Close</md-button>' +
            ' </div>' +
            '</md-dialog>',
          locals: {
            appSpace: appSpace
          },
          controller: DialogController
        };
        $mdDialog.show(appsDialog);
      };

      $scope.showUsersDialog = function(ev, appSpace) {
        var appsDialog = {
          parent: angular.element(document.body),
          ariaLabel: 'Users',
          template: '<md-dialog aria-label="List dialog">' +
            ' <md-dialog-content>' +
            '   <div flex="50" layout="column" >' +
            '     <div layout="row" layout-sm="row">' +
            '       <div flex="50">' +
            '         <h3 class="Tab">Manager</h3>' +
            '       </div>' +
            '       <div flex=50 ng-repeat="user in managers">' +
            '         <p class="Tab">{{user.metadata.guid}}</p>' +
            '       </div>' +
            '     </div>' +
            '     <div layout="row" layout-sm="row">' +
            '       <div flex="50">' +
            '         <h3 class="Tab">Auditors</h3>' +
            '       </div>' +
            '       <div flex=50 ng-repeat="user in auditors">' +
            '         <p class="Tab">{{user.metadata.guid}}</p>' +
            '       </div>' +
            '     </div>' +
            '     <div layout="row" layout-sm="row">' +
            '       <div flex="50">' +
            '         <h3 class="Tab">Developer</h3>' +
            '       </div>' +
            '       <div flex=50 ng-repeat="user in developers">' +
            '         <p class="Tab">{{user.metadata.guid}}</p>' +
            '       </div>' +
            '     </div>' +
            '   </div>' +
            ' </md-dialog-content>' +
            ' <div class="md-actions">' +
            '   <md-button ng-click="hide()" class="md-primary">Close</md-button>' +
            ' </div>' +
            '</md-dialog>',
          locals: {
            appSpace: appSpace
          },
          controller: DialogController
        };
        $mdDialog.show(appsDialog);
      };

      $scope.goToAppSettings = function(app) {
      $state.go('app-settings', {
        organizationId: $scope.appSpace.organization_guid,
        applicationId: app.metadata.guid
      });}
    });



function DialogController($scope, $state, $location, $mdDialog, Restangular, appSpace) {
  $scope.apps = appSpace.apps;
  $scope.managers = appSpace.managers;
  $scope.auditors = appSpace.auditors;
  $scope.developers = appSpace.developers;
  $scope.service_instances = appSpace.service_instances;

  $scope.hide = function() {
    $mdDialog.hide();
  };
    $scope.goToAppSettings = function(app) {
    $state.go('app-settings', {
      organizationId: appSpace.organization_guid,
      applicationId: app.metadata.guid
    });
    $mdDialog.hide();
  }
}
