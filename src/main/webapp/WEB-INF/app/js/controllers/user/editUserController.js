angular.module('controllers')
  .controller('editUserController',
    function EditUserController($scope, $state) {

    var self = this;
    self.edited = true;

    // spaces
    self.spacesRequireMatch = true;
    self.allSpaces = loadAllSpaces();
    self.selectedSpaces = getSpacesToSelect();
    self.selectedSpace = null;
    self.searchSpaceText = null;
    self.querySpaceSearch = querySpaceSearch;

    function loadAllSpaces() {
      var allSpaces = [];
      $state.params.spaces.forEach(function(space) {
        var s = {
          name: space.entity.name,
          guid: space.metadata.guid
        };
        s._lowername = s.name.toLowerCase();
        allSpaces.push(s);
      });
      return allSpaces;
    }

    function getSpacesToSelect() {
      var selectedSpaces = [];

      $state.params.user.spaces.forEach(function(space) {

        var s = {
          name: space.entity.name,
          guid: space.metadata.guid
        };
        s._lowername = s.name.toLowerCase();

        selectedSpaces.push(_.find(self.allSpaces, function(item) {
          return item.guid == s.guid;
        }));
      });
      return selectedSpaces;
    }

    function querySpaceSearch (query) {
      var results = query ? self.allSpaces.filter(createFilterForSpace(query)) : [];
      return results;
    }

    function createFilterForSpace(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(space) {
        return (space._lowername.indexOf(lowercaseQuery) != -1);
      };
    }




});
