angular.module('customFilters', []).filter('defaultList', function() {
  return function(input, list, attr) {

    var arr = [];
    for(var objectKey in input) {
        arr.push(input[objectKey]);
    }

    arr.sort(function(a, b) {
      var textA;
      var textB;

      switch (attr) {
        case 'name':
          textA = a.entity.name.toUpperCase();
          textB = b.entity.name.toUpperCase();
          break;

        case 'label':
          textA = a.entity.label.toUpperCase();
          textB = b.entity.label.toUpperCase();
          break;
      }

      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });

    return arr;
  };
});
