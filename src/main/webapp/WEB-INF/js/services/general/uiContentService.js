/**
 * UiContentService
 **/

define(['angular'], function (angular) {
	"use strict";

	var uiContentService = function() {
		var services = {
			limitTextLength : function(text, length) {
				if (text && text.length > length) {
					var shortendText = text.split(/\s+/, length);
					return shortendText.join(" ") + '...';
				} else {
					return text;
				}
			}
		};

		return services;
	}
	uiContentService.$inject = [];

	return uiContentService;
});
