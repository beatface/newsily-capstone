app.factory("currentUserData", function() {

	var userData;

	return {
		setUserData: function(data) {
			userData = data;
		},
		getUserData: function() {
			return userData;
		}
	};

});