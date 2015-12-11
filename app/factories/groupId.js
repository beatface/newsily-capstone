app.factory("groupId", function() {

	var groupId;

	return {
		setGroupId: function(id) {
			groupId = id;
		},
		getGroupId: function() {
			return groupId;
		}
	};

});