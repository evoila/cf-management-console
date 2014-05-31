/**
 * provider.js
 **/
 
define(['angular', 'providers/appUrlManipulationProvider'], 
 	function (angular, AppUrlManipulationProvider) {
 		
 		var providers = angular.module('providers', []);

 		providers.provider('appUrlManipulation', AppUrlManipulationProvider);
 		providers.factory('appUrlManipulation', AppUrlManipulationProvider);
 });