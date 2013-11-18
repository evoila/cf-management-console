/**
 * bootstrap.js
 **/

define(['require', 'angular', 'app'], function(require, angular, app) {

  'use strict';
  
  return require(['domReady!'], function(document) {
  	console.log('bootstrap.js - called', document);
    return angular.bootstrap(document, ['myApp']);
  });
});