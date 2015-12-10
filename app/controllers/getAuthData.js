
app.controller("getAuthData", ["$scope", "$firebaseAuth", "$state", 
	function($scope, $firebaseAuth, $state) {

	console.log("get auth data");

	var ref = new Firebase("https://newsily.firebaseio.com/users");

	$scope.ref = $firebaseAuth(ref);

	var authData = $scope.ref.$getAuth();

	console.log("ref", ref);
	console.log("scope ref", $scope.ref);
	console.log("authData", authData);

	// for child controller access
	$scope.userAuthData = authData;

	if (authData) {
	  console.log("Logged in as:", authData.uid);
	  // $state.go('');
	} else {
	  console.log("Logged out");
	  // $state.go('login');
	}

}]); // end app controller