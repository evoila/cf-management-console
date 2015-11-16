'use strict';

angular.module('services')
  .factory('menu', [
    '$location',
    '$rootScope',
    '$state',
    function($location, $scope, $state) {
      console.log('menu service');
      var organization = {};

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

      sections.push({
        name: 'Users',
        type: 'link',
        state: 'users',
        params: {},
        icon: 'fa fa-group'
      });

      sections.push({
        name: 'Marketplace',
        type: 'link',
        state: 'marketplace',
        icon: 'fa fa-shopping-cart'
      });

      sections.push({
        name: 'Domains',
        type: 'link',
        state: 'users',
        icon: 'fa fa-group'
      });

      var self;

      return self = {
        sections: sections,
        organization: organization,
        organizations: organizations,

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

        /*Adds all organisations to the menu*/
        orgsToMenu: function(orgas) {
          organizations.name = 'Organizations ('+orgas.length+')';
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
        },

        spacesToMenu: function(orgaId, spaces) {
          sections[0].pages = [];

          angular.forEach (spaces, function(space, key) {
              var page = {};
              page.name = space.entity.name;
              page.type = 'link';
              page.state = 'space';
              page.params = {
                organizationId : orgaId,
                spaceId: space.metadata.guid
              };
              sections[0].pages.push(page);
              console.log("drinsdf");
          });
        }
      };



      function sortByHumanName(a, b) {
        return (a.humanName < b.humanName) ? -1 :
          (a.humanName > b.humanName) ? 1 : 0;
      }

    }
  ])
