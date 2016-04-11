
app.controller("profileCtrl", ["$scope", "$state", "currentUserData",
	function($scope, $state, currentUserData) {


	// ------- SAVE PROFILE INFO ------- //
	$scope.updateProfile = function() {
		var currentUser = currentUserData.getUserData();
		var ref = new Firebase("https://newsily.firebaseio.com/users/" + currentUser.uid);

		ref.child("firstname").set($scope.firstname);
		ref.child("lastname").set($scope.lastname);
		ref.child("username").set($scope.username);
		if ($scope.userphoto !== undefined && $scope.userphoto !== null && $scope.userphoto !== " ") {
			ref.child("photo").set($scope.userphoto);
		}
        $state.go('create-or-join');
	};
}]);
