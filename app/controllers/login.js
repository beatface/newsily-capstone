
app.controller("loginCtrl", ["$scope", "$firebaseAuth", "$state", 
	function($scope, $firebaseAuth, $state) {
		console.log("login js");

	// existing user login
	$scope.login = function() {
		var userObj = {
			email: $scope.user_email,
			password: $scope.user_password
		};

		$scope.$parent.ref.$authWithPassword(userObj)
		.then(function(authData) {
		  console.log("Logged in as:", authData.uid);
		  // $state.go("main-page.content");
		}).catch(function(error) {
		  console.error("Error: ", error);
		});
	};

	// register new user through email
	$scope.registerUser = function() {
		console.log("you clicked register");
		var userObj = {
			email: $scope.user_email,
			password: $scope.user_password
		};
		console.log("userObj", userObj);

		$scope.$parent.ref.$createUser(userObj)
		.then(function(userData) {
		  console.log("User " + userData.uid + " created successfully!");
		  return $scope.ref.$authWithPassword(userObj);
		}).then(function(authData) {
		  console.log("Logged in with email as:", authData.uid);
		  $state.go('create-or-join');
		}).catch(function(error) {
		  console.error("Error: ", error);
		});
	};

	// register new user with facebook
	$scope.facebookRegister = function() {
		$scope.$parent.ref.$authWithOAuthPopup("facebook")
		.then(function(authData) {
		  	console.log("Logged in with Facebook as:", authData.uid);
		  	$state.go('create-or-join');
		}).catch(function(error) {
		 	 console.error("Authentication failed:", error);
		});
	};



}]); // end app controller


