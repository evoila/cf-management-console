/**
 * directives.js
 **/

define(['angular',
	'directives/highchartDirective',
	],
 	function (angular, 		
 		HighchartDirective) {

		var directives = angular.module('directives', []);

 		directives.directive('highchart', HighchartDirective);

 });