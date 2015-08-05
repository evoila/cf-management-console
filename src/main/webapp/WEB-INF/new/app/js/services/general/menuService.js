'use strict';

angular.module('services')
  .factory('menu', [
    '$location',
    '$rootScope',
    function($location) {

      var sections = [{
        name: 'Organisations',
        type: 'toggle'
      }];

      sections.push({
        name: 'App Spaces',
        type: 'toggle',
        state: 'app-spaces'
      });

      sections.push({
        name: 'Users',
        type: 'toggle',
        state: 'marketplace',
        pages: [{
          name: 'Cheetos',
          type: 'link',
          state: 'home.findwood',
          icon: 'fa fa-group'
        }, {
          name: 'Banana Chips',
          state: 'home.woodlist',
          type: 'link',
          icon: 'fa fa-map-marker'
        }, {
          name: 'Donuts',
          state: 'home.woodlow',
          type: 'link',
          icon: 'fa fa-map-marker'
        }]
      });

      sections.push({
        name: 'Marketplace',
        type: 'link',
        state: 'marketplace'
      });

      var self;

      return self = {
        sections: sections,

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
