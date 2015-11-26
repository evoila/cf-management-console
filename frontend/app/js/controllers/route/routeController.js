angular.module('controllers')
  .controller('routeController',
    function RouteController($scope, $state, Restangular, menu, clientCacheService, DesignService, responseService, $mdDialog, $location) {

      $scope.orgId = $state.params.organizationId;

      $scope.init = function() {

        Restangular.one('private_domains', $state.params.organizationId).getList().then(function(domains) {
          $scope.domains = domains;
        });

        Restangular.one('organizations', $state.params.organizationId).get().then(function(org) {
          $scope.spaces = org.entity.spaces;
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
       *  Create new route
       *
       */
      $scope.showCreateRouteDialog = function(ev) {
        $mdDialog.show({
          locals: {
            domains: $scope.domains,
            spaces: $scope.spaces
          },
          controller: ['$scope', 'domains', 'spaces', function($scope, domains, spaces) {
            $scope.domains = domains;
            $scope.spaces = spaces;

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
