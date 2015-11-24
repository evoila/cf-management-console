angular.module('controllers', ['services']);
angular.module('common.services', []);
angular.module('myMenuApp.controllers', ['common.directives']);
angular.module('common.directives', ['common.services']);
