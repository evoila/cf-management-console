/**
 * AppUrlManipulationProvider
 **/
define(function () {
	'use strict';
	
	var appUrlManipulationProvider = function () {

		this.entityId = function(entity) {
			var link = this.relations(entity, 'self');
			if (link != undefined) {
				var id = link.href.substring(link.href.lastIndexOf('/') + 1, link.href.length);
				if (!isNaN(parseFloat(id)) && isFinite(id))
					entity.id = Number(id);
				else
					entity.id = id;
			}
			return entity;
		};

		this.relations = function(entity, relation) {
			if (entity.links !== undefined) {
				if (entity.links.length > 0) {
					for (var i = 0; i < entity.links.length; i++) {
						var position = -1;
						if (entity.links[i].rel !== 'self') {
							position = entity.links[i].rel.lastIndexOf('.') + 1;
						} else {
							position = 0;
						}
						var length = entity.links[i].rel.length;
						if (position !== -1) {
							var rel = entity.links[i].rel.substring(position, length);
							if (rel === relation) {
								return entity.links[i];
							}
						}
					}
				}
				return undefined;
			}
		};
		
		this.$get = [function appUrlManipulationFactory() {
    		return new appUrlManipulation(entityId);
  		}];
				
	}

	return appUrlManipulationProvider;
});