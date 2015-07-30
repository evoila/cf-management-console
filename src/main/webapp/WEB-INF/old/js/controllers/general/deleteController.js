/**
 * DeleteController
 **/

define(function () {
	'use strict';	
	
	function DeleteController($scope, $modalInstance) {
		$scope.ok = function () {
			$modalInstance.close('ok');
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}

	DeleteController.$inject = ['$scope', '$modalInstance'];

	return DeleteController;
});