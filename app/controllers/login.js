
app.controller("loginCtrl", ["$scope", "$firebaseAuth", "$state", "$firebaseArray", "$firebaseObject", "groupId",
	function($scope, $firebaseAuth, $state, $firebaseArray, $firebaseObject, groupId) {
		console.log("login js");

	$scope.user_email = "";

	// ------- EXISTING USER LOGIN ------- //
	$scope.login = function() {
		var userObj = {
			email: $scope.user_email,
			password: $scope.user_password
		};
		$scope.$parent.ref.$authWithPassword(userObj)
		.then(function(authData) {
		  console.log("Logged in as:", authData.uid);
		  var userGroups = new Firebase("https://newsily.firebaseio.com/users/" + authData.uid + "/joined_groups");
		  // getting user's joined groups and setting group factory with first group in the array
		  userGroups.once("value", function(snapshot) {
		  	var groups = snapshot.val();
		  	console.log("user groups", groups[0]);
			groupId.setGroupId(groups[0]);
		  });
		  $state.go("newsily-main.posts");
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
		// create user
		$scope.$parent.ref.$createUser(userObj)
		.then(function(userData) {
		  console.log("User " + userData.uid + " created successfully!");
		  // log user in
		  return $scope.ref.$authWithPassword(userObj);
		}).then(function(authData) {
		  console.log("Logged in with email as:", authData.uid);
		  // assign user data to parent scope for easy access from other controllers
		  $scope.$parent.userAuthData = authData;
		  // add user data to firebase
		  $scope.saveProfile();
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
		ref.email = $scope.user_email;
		ref.$save().then(function () {
            console.log(ref);
            // $state.go('create-or-join');
        });
	};



}]); // end app controller


