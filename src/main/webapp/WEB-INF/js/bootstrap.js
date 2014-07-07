/**
 * bootstrap.js
 **/

define(['require', 'angular', 'app'], function(require, angular, app) {

  'use strict';
  
  return require(['domReady!'], function(document) {
	console.log('bootstrap.js - called');	
	try {
		angular.bootstrap(document, ['myApp']);
	}
	catch (e) {
		console.error(e.stack || e.message || e);
	}
  });
});