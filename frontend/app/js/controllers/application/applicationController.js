/**
 * AppSettingsController
 **/


angular.module('controllers')
  .controller('applicationController',
    function ApplicationController($scope, $state, $mdDialog, Restangular, DesignService, responseService) {
      $scope.organizationId = $state.params.organizationId;
      $scope.appId = $state.params.applicationId;

      var originatorEv;

      $scope.query = {
        filter: '',
        order: 'entity.stats.host',
        limit: 10,
        page: 1
      };

      $scope.init = function() {

        Restangular.one('applications', $scope.appId).get().then(function(application) {
          $scope.application = application;

          Restangular.one('applications', $scope.appId).all('instances').getList().then(function(instances) {
            $scope.instances = instances;

            Restangular.one('applications', $scope.appId).all('stats').getList().then(function(appStatus) {
              $scope.appStatus = appStatus;

              appStatus.forEach(function(stat) {
                stat.entity.stats.uptime = stat.entity.stats.uptime / 3600;
                stat.entity.stats.usage.mem = stat.entity.stats.usage.mem / 1024 / 1024 / 1024;
                stat.entity.stats.mem_quota = stat.entity.stats.mem_quota / 1024 / 1024 / 1024;
                stat.entity.stats.usage.disk = stat.entity.stats.usage.disk / 1024 / 1024 / 1024;
                stat.entity.stats.disk_quota = stat.entity.stats.disk_quota / 1024 / 1024 / 1024;
              })

            }, function(response) {
              console.log(response)
            })
          }, function(response) {
            console.log(response)
          });

          angular.forEach(application.entity.service_bindings, function(binding) {
            Restangular.one('applications', $scope.appId).one('bindings', binding.entity.service_instance_guid).get().then(function(serviceBinding) {
              console.log(serviceBinding);
            });
          });
        }, function(response) {
          console.log(response)
        });
      };


      $scope.startApplication = function(application) {
        application.entity.state = "STARTED";

        Restangular.one('applications', application.metadata.guid).customPUT(application, null, null, null).then(function(data) {
          console.log("app started");
          responseService.success(data, 'application started');
        });
      };

      $scope.stopApplication = function(application) {
        application.entity.state = "STOPPED";

        Restangular.one('applications', application.metadata.guid).customPUT(application, null, null, null).then(function(data) {
          console.log("app stopped");
          responseService.success(data, 'application stopped');
        });
      };

      $scope.getInstancesDetails = function() {
        Restangular.one('applications/' + $state.params.applicationId + '/stats').get().then(function(appStatus) {
          console.log(appStatus)
        })
      }


      /*
       *  Dialog for
       *
       *  Scale application
       *
       */
      $scope.showScaleAppDialog = function(ev, application) {
        $mdDialog.show({
          locals: {
            application: application
          },
          controller: ['$scope', 'application', function($scope, application) {
            $scope.application = application;
            $scope.instanceCount = application.entity.instances;

            $scope.scaleApplication = function(application) {

              //delete application.entity.docker_credentials_json;

              Restangular.one('applications', application.metadata.guid).customPUT(application, undefined, undefined, undefined).then(function(data) {
                responseService.success(data, 'Application was scaled successfully', 'application', {
                  organizationId : application.entity.space.entity.organization_guid,
                  spaceId : application.entity.space.metadata.guid,
                  applicationId : application.metadata.guid
                });
              }, function(response) {
                console.log(response)
              });
            }

            $scope.hide = function() {
              $mdDialog.hide();
            };

            $scope.cancel = function() {
              $mdDialog.cancel();
            };
          }],
          templateUrl: 'partials/application/application-scale-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false
        })
      };

      $scope.deleteApplication = function(ev, application) {
         var confirm = $mdDialog.confirm()
               .title('Really delete this application?')
               .textContent(application.entity.name)
               .ariaLabel('Confirm delete')
               .targetEvent(ev)
               .ok('Yes')
               .cancel('Better not');
         $mdDialog.show(confirm).then(function() {
           Restangular.one('applications', application.metadata.guid).remove().then(function(data) {
             console.log("app deleted");
             responseService.success(data, 'application deleted', 'space-list', $state.params);
           });
         });
       };

      $scope.colorString = function(name) {
        var myColor = DesignService.stringColor(name);
        return myColor;
      };

      $scope.servicePng = function(name) {
        var myService = DesignService.resolveServicePng(name);
        return myService;
      };

    });
