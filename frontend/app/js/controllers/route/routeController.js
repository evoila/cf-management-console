angular.module('controllers')
  .controller('routeController',
    function RouteController($scope, $state, Restangular, menu, clientCacheService, DesignService, responseService, $mdDialog, $location) {

      $scope.orgId = $state.params.organizationId;
      $scope.readOnly = true;

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
          $scope.apps = apps;
        }, function(response) {
          responseService.error(response);
        });

        $scope.w_collapsed = '250px;'
        $scope.w_expanded = '510px';
        $scope.h_collapsed = '140px';
        $scope.h_expanded = '290px';

        Restangular.one('routes').getList().then(function(routes) {
          routes.forEach(function(route) {
            route.w = $scope.w_collapsed;
            route.h = $scope.h_collapsed;
          })
          $scope.routes = routes;

          initContainer();

        });
      }

      $scope.updateRoute = function(route) {
        console.log(route)

        Restangular.one('routes', route.metadata.guid)//.put({ "host": "abcdef" }).then(function(route){
          .customPUT(undefined, undefined, ({ "host": "new host" }), undefined).then(function(route){
            $scope.readOnly = false;
            $state.go('routes', {organizationId : $scope.orgId});
        }, function(response) {
          console.log(response)
          responseService.error(response);
        })

      };





      $scope.toggle = function(item, event) {
        var id = event.currentTarget.attributes.id.value.replace('tglbt', 'item');
        if(item.w == $scope.w_collapsed)
          expand(item, id);
        else
          collapse(item);
      }

      function expand(item, gotoId) {
        item.w = $scope.w_expanded;
        item.h = $scope.h_expanded;
        initContainer();
        $('html, body').animate({
          scrollTop: $('#'+gotoId).offset().top
        }, "slow");
      }

      function collapse(item) {
        item.w = $scope.w_collapsed;
        item.h = $scope.h_collapsed;
        initContainer();
        $("html, body").animate({ scrollTop: 0 }, "slow");
      }

      $scope.colorString = function(name) {
        var myColor = DesignService.stringColor(name);
        return myColor;
      };

      function initContainer() {
        $('#masonry-container').freetile({
            animate: true,
            elementDelay: 10,
            selector: '.item',
            containerResize: true
        });
      }

      /*
       *  Dialog for
       *
       *  Confirm delete route
       *
       */
       $scope.showConfirm = function(ev, route, method) {
         var title, content = null;

        if(method == 'delete') {
          title = 'Really delete route?';
          content = route.entity.domain.entity.name + ' in space ' + route.entity.space.entity.name;
        }

        var confirm = $mdDialog.confirm()
              .title(title)
              .content(content)
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

      /*
       *  Dialog for
       *
       *  Associate route with app
       *
       */
      $scope.showAssociateRouteDialog = function(ev, route) {
        $mdDialog.show({
          locals: {
            apps: $scope.apps,
            route: route
          },
          controller: ['$scope', 'apps', 'route', function($scope, apps, route) {
            $scope.orgId = $state.params.organizationId;
            $scope.apps = apps;
            $scope.route = route;

            $scope.submitAssociateRouteForm = function(form) {
              $scope.noApp = false;

              if(!form.app_guid)
                $scope.noApp = true;

              else {
                console.log('routeId: ' + route.metadata.guid + ', appId: ' + form.app_guid)
                Restangular.all('routes/' + route.metadata.guid + '/apps/' + form.app_guid)
                  .customPUT(undefined, undefined, undefined, undefined).then(function(route){
                  $mdDialog.hide();
                  $state.go('routes', {organizationId : $scope.orgId});
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
          templateUrl: 'partials/route/route-associate-dialog.html',
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

              else if(form.path && form.path.indexOf('/') != 0)
                $scope.invalidPath = true;

              else {
                Restangular.all('routes').post(form).then(function(route) {
                  $mdDialog.hide();
                  responseService.success(route, 'Route was created successfully', 'routes', { organizationId : $scope.orgId });
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
          templateUrl: 'partials/route/route-create-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false
        })

      };



  });
