'use strict';

angular.module('services')
  .factory('menu', [
    '$location',
    '$rootScope',
    '$state',
    'Restangular',
    function($location, $scope, $state, Restangular) {
      var organizationInt = {};
      var spacesInt = {};

      var organizations = {
        name: 'Organisations',
        type: 'toggle'
      };

      var sections = [{
        name: 'Spaces',
        type: 'toggle',
        state: 'spaces',
        icon: 'fa fa-cubes'
      }];

      var self;

      return self = {
        sections: sections,
        organization: organizationInt,
        organizations: organizations,
        spaces : spacesInt,

        toggleSelectSection: function(section) {
          self.openedSection = (self.openedSection === section ? null : section);
        },
        isSectionSelected: function(section) {
          return self.openedSection === section;
        },

        selectPage: function(section, page) {
          page && page.url && $location.path(page.url);
          self.currentSection = section;
          self.currentPage = page;
        },

        initMenu: function(callback) {
          Restangular.all('organizations').getList().then(function(data) {
            self.organization = data[0];
            self.orgsToMenu(data, function() {
              Restangular.one('organizations', self.organization.metadata.guid).all('spaces').getList().then(function(spaces) {
                self.spacesInt = spaces;
                self.spacesToMenu(self.organization.metadata.guid);
              });
              if (typeof(callback) == "function")
                callback(self.organization);
            });
          });
        },

        orgsToMenu: function(orgas, callback) {
          organizationInt = orgas[0];

          organizations.name = 'Organizations (' + orgas.length + ')';
          organizations.pages = [];
          angular.forEach (orgas, function(orga, key) {
              var page = {};
              page.name = orga.entity.name;
              page.type = 'link';
              page.state = 'spaces';
              page.params = {organizationId: orga.metadata.guid};
              page.orga = orga;
              organizations.pages.push(page);
          });

          if (typeof(callback) == "function")
            callback();
        },

        spacesToMenu: function(orgaId) {
          sections[0].pages = [];
          sections[0].params = { "organizationId" : orgaId };

          angular.forEach (self.spacesInt, function(space, key) {
              var page = {};
              page.name = space.entity.name;
              page.type = 'link';
              page.state = 'space';
              page.params = {
                organizationId : orgaId,
                spaceId: space.metadata.guid
              };
              sections[0].pages.push(page);
          });

          sections[1] = {
            name: 'Users',
            type: 'link',
            state: 'users',
            params: { "organizationId" : orgaId },
            icon: 'fa fa-group'
          };

          sections[2] = {
            name: 'Marketplace',
            type: 'link',
            state: 'marketplace',
            params: { "organizationId" : orgaId },
            icon: 'fa fa-shopping-cart'
          };

          sections[3] = {
            name: 'Domains',
            type: 'link',
            state: 'users',
            params: { "organizationId" : orgaId },
            icon: 'fa fa-group'
          };
        }
      };

    }
  ])
