
app.controller("loginCtrl", ["$scope", "$firebaseAuth", "$state", "$firebaseArray", "$firebaseObject",
	function($scope, $firebaseAuth, $state, $firebaseArray, $firebaseObject) {
		console.log("login js");

	// ------- EXISTING USER LOGIN ------- //
	$scope.login = function() {
		var userObj = {
			email: $scope.user_email,
			password: $scope.user_password
		};
		$scope.$parent.ref.$authWithPassword(userObj)
		.then(function(authData) {
		  console.log("Logged in as:", authData.uid);
		  $state.go("newsily-main");
		}).catch(function(error) {
		  console.error("Error: ", error);
		});
	};


	// ------- REGISTER NEW USER THROUGH EMAIL ------- //
	$scope.registerUser = function() {
		console.log("you clicked register");
		var userObj = {
			email: $scope.user_email,
			password: $scope.user_password
		};
		$scope.$parent.ref.$createUser(userObj)
		.then(function(userData) {
		  console.log("User " + userData.uid + " created successfully!");
		  return $scope.ref.$authWithPassword(userObj);
		}).then(function(authData) {
		  console.log("Logged in with email as:", authData.uid);
		  $scope.$parent.userAuthData = authData;
		  $state.go('create-or-join');
		}).catch(function(error) {
		  console.error("Error: ", error);
		});
	};


	// ------- REGISTER NEW USER THROUGH FACEBOOK ------- //
	$scope.facebookRegister = function() {
		$scope.$parent.ref.$authWithOAuthPopup("facebook")
		.then(function(authData) {
		  	console.log("Logged in with Facebook as:", authData.uid);
		  	$scope.$parent.userAuthData.uid = authData.uid;
		  	$state.go('update-profile');
		}).catch(function(error) {
		 	console.error("Authentication failed:", error);
		});
	};


	// ------- SAVE PROFILE INFO ------- //
	$scope.saveProfile = function() {
		console.log("you clicked save");
		var ref = new Firebase("https://newsily.firebaseio.com/users/" + $scope.$parent.userAuthData.uid);
		ref = $firebaseObject(ref);
		ref.email = $scope.addemail;
		ref.name = $scope.firstname;
		ref.$save().then(function () {
            console.log(ref);
            $state.go('create-or-join');
        });
	};



}]); // end app controller


