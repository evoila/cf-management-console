'use strict';

angular.module('services')
  .factory('menu', [
    '$location',
    '$rootScope',
    function($location) {

      var organization = {};

      var organizations = {
        name: 'Organisations',
        type: 'toggle'
      };

      var sections = [{
        name: 'App Spaces',
        type: 'toggle',
        state: 'app-spaces'
      }];

      sections.push({
        name: 'Users',
        type: 'toggle',
        state: 'marketplace',
        icon: 'fa fa-group'
      });

      sections.push({
        name: 'Marketplace',
        type: 'link',
        state: 'marketplace'
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
        }
      };

      function sortByHumanName(a, b) {
        return (a.humanName < b.humanName) ? -1 :
          (a.humanName > b.humanName) ? 1 : 0;
      }

    }
  ])
