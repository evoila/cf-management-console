/**
 * AlertController
 **/

define(function () {
	'use strict';	
	
	function AlertController($scope, $rootScope, $timeout, messageEmitter) {
		var timeout = 3500;
		var alertChannel = "alertChannel";
		$scope.alerts = [];
		
		$rootScope.$on(alertChannel, function(event, data) {
			$scope.alerts.push(data);
				 
			$timeout(function(data) {
				if ($scope.alerts.length > 0) {
					$scope.closeAlert(0);
				}
			}, timeout);
		});

		$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
		};

		$scope.msg = function(type) {
			messageEmitter.message('Message', 'Please check the message below!', type);
		};
	}

	AlertController.$inject = ['$scope', '$rootScope', '$timeout', 'messageEmitter'];

	return AlertController;
});