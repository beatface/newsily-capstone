app.factory("currentUserData", ["$firebaseAuth", function($firebaseAuth) {

	var initialRef = new Firebase("https://newsily.firebaseio.com/users");
    initialRef = $firebaseAuth(initialRef);
    var authData = initialRef.$getAuth();

	return {
		setUserData: function(data) {
			authData = data;
		},
		getUserData: function() {
			if (!!authData) {
				return authData;
			} else {
				return false;
			}
		}
	};

}]);