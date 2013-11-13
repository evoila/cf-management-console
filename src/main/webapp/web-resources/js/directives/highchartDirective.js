/**
 * ChartDirective.js
 **/

define(['angular'], function (angular) {
	"use strict";

	var chartDirective = {};

	chartDirective = function($compile) {
		return {
			restrict: 'E',
			template: '<div></div>',
			transclude:true,
			replace: true,

			link: function (scope, element, attrs) {
				var chartsDefaults = {
					chart: {
						renderTo: element[0],
						type: attrs.type || null,
						height: attrs.height || null,
						width: attrs.width || null,
					}
				};

				scope.$watch(function() { 
					return attrs.value; 
				}, function(value) {
					if(!attrs.value) return;
						var deepCopy = true;
						var newSettings = {};

						angular.extend(newSettings, chartsDefaults, JSON.parse(attrs.value));						
						var chart = new Highcharts.Chart(newSettings);
				});
			}
		};
	};
	
	chartDirective.$inject = ['$compile'];

	return chartDirective;
});