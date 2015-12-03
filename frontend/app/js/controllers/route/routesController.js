angular.module('controllers')
  .controller('routesController',
    function RoutesController($scope, $state, Restangular, menu, clientCacheService, DesignService, responseService, $mdDialog, $location) {

      $scope.orgId = $state.params.organizationId;
      $scope.editActive = false;

      var originatorEv;

      $scope.query = {
        filter: '',
        order: 'entity.domain.entity.name',
        limit: 10,
        page: 1
      };

      $scope.openMenu = function($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
      };

      $scope.init = function() {

        Restangular.one('private_domains', $state.params.organizationId).getList().then(function(domains) {
          $scope.domains = domains;
        }, function(response) {
          responseService.error(response);
        });

        Restangular.one('organizations', $state.params.organizationId).get().then(function(org) {
          $scope.spaces = org.entity.spaces;
        }, function(response) {
          responseService.error(response);
        });

        Restangular.one('apps', $state.params.organizationId).get().then(function(apps) {
          $scope.allApps = apps;

        }, function(response) {
          responseService.error(response);
        });

        Restangular.one('routes').getList().then(function(routes) {
          routes.forEach(function(route) {
            route.readOnly = true;
            getSelectableApps(route);
          })
          $scope.routes = routes;
        });
      }

      function getSelectableApps(route) {
        route.apps = [];
        route.entity.apps.forEach(function(app) {
          var appId = app.metadata.guid;
          route.apps = _.reject($scope.allApps, function(el) { return el.metadata.guid === appId; });
        })
        route.apps = _.reject($scope.allApps, function(el) { return el.entity.space_guid !== route.entity.space_guid; });
        route.maxApps = route.apps.length;
      }


      $scope.prepareEdit = function(route) {
        $scope.editActive = true;
        route.readOnly = false;
        $scope.oldHost = route.entity.host;
        $scope.oldPath = route.entity.path;
        $scope.oldPort = route.entity.port;
      }

      $scope.cancelEdit = function(route) {
        $scope.editActive = false;
        route.entity.host = $scope.oldHost;
        route.entity.path = $scope.oldPath;
        route.entity.port = $scope.oldPort;
        route.readOnly = true;
      }

      $scope.updateRoute = function(route) {

        if(route.entity.host.length < 4)
          route.invalidHost = 'Host must be at least 4 characters'

        else if(route.entity.path && route.entity.path.length < 2 || route.entity.path.length > 128)
          route.invalidPath = 'Path must be between 2 and 128 characters';

        else if(route.entity.path && route.entity.path.indexOf('/') != 0 || route.entity.path && route.entity.path.indexOf('?') > -1)
          route.invalidPath = 'Path must begin with "/", character "?" is not allowed';

        else if(route.entity.port && route.entity.port < 1024 || route.entity.port > 65535)
          route.invalidPort = 'Port must be betwenn 1024 and 65535';

        else {
          delete route.invalidPath;
          delete route.invalidHost;
          delete route.invalidPort;
          delete route.readOnly;

          Restangular.one('routes', route.metadata.guid)
            .customPUT(route, undefined, undefined, undefined).then(function(route){
              responseService.success(route, 'Route was updated successfully', 'routes', { organizationId : $scope.orgId });
          }, function(response) {
            if(response.status == '400' && response.data.message.indexOf('domains of TCP router groups only') > -1)
              responseService.error(response, 'Port is supported for domains of TCP router groups only');
            else {
              $mdDialog.hide();
              responseService.error(response);
            }
          })
        }
      };

      $scope.colorString = function(name) {
        var myColor = DesignService.stringColor(name);
        return myColor;
      };


      /*
       *  Dialog for
       *
       *  Confirm delete route
       *
       */
       $scope.showConfirm = function(ev, route) {
        var confirm = $mdDialog.confirm()
              .title('Really delete route?')
              .textContent(route.entity.domain.entity.name + ' in space ' + route.entity.space.entity.name)
              .ariaLabel('Confirm delete')
              .targetEvent(ev)
              .ok('Yes')
              .cancel('Better not');
        $mdDialog.show(confirm).then(function() {
          deleteRoute(route);
        });
      };

      function deleteRoute(route) {
        Restangular.one('routes', route.metadata.guid).remove().then(function() {
          responseService.success(route, 'Route was deleted successfully', 'routes', { organizationId : $scope.orgId });
        }, function(response) {
          responseService.error(response);
        });
      }


      $scope.prepareAssociateDialog = function(ev, route) {
        route.entity.apps.forEach(function(app) {
          var appId = app.metadata.guid;
          route.apps = _.reject(route.apps, function(el) { return el.metadata.guid === appId; });
        })
        $scope.showAssociateRouteDialog(ev, route);
      };

      /*
       *  Dialog for
       *
       *  Associate route with app
       *
       */
      $scope.showAssociateRouteDialog = function(ev, route) {
        $mdDialog.show({
          locals: {
            apps: route.apps,
            route: route
          },
          controller: ['$scope', 'apps', 'route', function($scope, apps, route) {
            $scope.orgId = $state.params.organizationId;
            $scope.route = route;
            $scope.apps = apps;

            $scope.submitAssociateRouteForm = function(form) {
              $scope.noApp = false;

              if(!form.app_guid)
                $scope.noApp = true;

              else {
                Restangular.all('routes/' + route.metadata.guid + '/apps/' + form.app_guid)
                  .customPUT(undefined, undefined, undefined, undefined).then(function(route){
                  $mdDialog.hide();
                  responseService.success(route, 'Association was successful', 'routes', { organizationId : $scope.orgId });
                }, function(response) {
                  if(response.status == '400' && response.data.message.indexOf('Invalid relation') > -1)
                    responseService.error(response, 'Invalid relation');
                  else
                    responseService.error(response);
                })
              }
            };

            $scope.hide = function() {
              $mdDialog.hide();
            };

            $scope.cancel = function() {
              $mdDialog.cancel();
            };

          }],
          templateUrl: 'partials/route/route-associate-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false
        })
      };



      /*
       *  Dialog for
       *
       *  Remove app from route
       *
       */
       $scope.showRemoveAppDialog = function(ev, route) {
         console.log('route.apps: ' + route.apps.length)
         console.log('route.entity.apps: ' + route.entity.apps.length)

         $mdDialog.show({
           locals: {
             route: route
           },
           controller: ['$scope', 'route', function($scope, route) {
             $scope.orgId = $state.params.organizationId;
             $scope.route = route;

             $scope.submitRemoveAppForm = function(form) {
               $scope.noApp = false;

               if(!form.app_guid)
                 $scope.noApp = true;

               else {
                 Restangular.one('routes/' + route.metadata.guid + '/apps/' + form.app_guid).remove().then(function() {
                 $mdDialog.hide();
                 responseService.success(route, 'Removing App was successful', 'routes', { organizationId : $scope.orgId });
               }, function(response) {
                 responseService.error(response);
               })
               }
             };

             $scope.hide = function() {
               $mdDialog.hide();
             };

             $scope.cancel = function() {
               $mdDialog.cancel();
             };

           }],
           templateUrl: 'partials/route/route-remove-app-dialog.html',
           parent: angular.element(document.body),
           targetEvent: ev,
           clickOutsideToClose:false
         })
       };


      /*
       *  Dialog for
       *
       *  Create new route
       *
       */
      $scope.showCreateRouteDialog = function(ev) {
        $mdDialog.show({
          locals: {
            domains: $scope.domains,
            spaces: $scope.spaces,
          },
          controller: ['$scope', 'domains', 'spaces', function($scope, domains, spaces) {
            $scope.orgId = $state.params.organizationId;
            $scope.domains = domains;
            $scope.spaces = spaces;

            $scope.submitCreateRouteForm = function(form) {
              $scope.noDomain = false;
              $scope.noSpace = false;
              $scope.invalidPath = false;

              if(!form.domain_guid)
                $scope.noDomain = true;

              else if(!form.space_guid)
                $scope.noSpace = true;

              else if(form.path && form.path.indexOf('/') != 0 || form.path && form.path.indexOf('?') > -1)
                $scope.invalidPath = true;

              else {
                var route = {
                  domain_guid: form.domain_guid,
                  space_guid: form.space_guid
                };
                Restangular.all('routes').post(form).then(function(route) {
                  $mdDialog.hide();
                  responseService.success(route, 'Route was created successfully', 'routes', { organizationId : $scope.orgId });
                }, function(response) {
                  console.log(response)
                  responseService.error(response);
                })
              }
            };

            $scope.hide = function() {
              $mdDialog.hide();
            };

            $scope.cancel = function() {
              $mdDialog.cancel();
            };

          }],
          templateUrl: 'partials/route/route-create-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false
        })

      };

  });
