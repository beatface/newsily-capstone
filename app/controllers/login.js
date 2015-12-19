
app.controller("loginCtrl", ["$scope", "$firebaseAuth", "$state", "$firebaseArray", "$firebaseObject", "groupId", "currentUserData", "$location",
	function($scope, $firebaseAuth, $state, $firebaseArray, $firebaseObject, groupId, currentUserData, $location) {
		console.log("login js");



	var initialRef = new Firebase("https://newsily.firebaseio.com/users");
    initialRef = $firebaseAuth(initialRef);
    var authData = initialRef.$getAuth();
    // console.log("Logged in as:", authData.uid);

    if (!!authData) {
        currentUserData.setUserData(authData);
        console.log("Logged in as:", authData.uid);
        console.log("current user's data *****", currentUserData.getUserData());
        // $location.path('/newsily-main/newsily-main-posts').replace();
        $state.go('newsily-main.posts');
    } else {
        console.log("Logged out");
        // $state.go('login');
    }




	$scope.user_email = "";
	$scope.user_password = "";

	var ref = new Firebase("https://newsily.firebaseio.com/users");
	ref = $firebaseAuth(ref);


	// ------- EXISTING USER LOGIN ------- //
	$scope.login = function() {
		var userObj = {
			email: $scope.user_email,
			password: $scope.user_password
		};
		
		ref.$authWithPassword(userObj)
		.then(function(authData) {
		  console.log("Logged in as:", authData.uid);
		  currentUserData.setUserData(authData);
		  var userGroups = new Firebase("https://newsily.firebaseio.com/users/" + authData.uid + "/joined_groups");
		  // getting user's joined groups and setting group factory with first group in the array
		  userGroups.once("value", function(snapshot) {
		  	var groups = snapshot.val();
	        var key = _.findKey(groups);  
	        // move one level down in object
		  	console.log("user's groups ....", groups[key]);
			groupId.setGroupId(groups[key]);
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
		ref.$createUser(userObj)
		.then(function(userData) {
		  console.log("User " + userData.uid + " created successfully!");
		  // log user in
		  return ref.$authWithPassword(userObj);
		}).then(function(authData) {
		  currentUserData.setUserData(authData);
		  console.log("Logged in with email as:", authData.uid);
		})
		.then(function() {
		  // add user data to firebase
		  $scope.saveProfile();
		  $state.go('create-or-join');
		}).catch(function(error) {
		  console.error("Error: ", error);
		});
	};


	// // ------- REGISTER NEW USER THROUGH FACEBOOK ------- //
	// $scope.facebookRegister = function() {
	// 	ref.$authWithOAuthPopup("facebook")
	// 	.then(function(authData) {
	// 	  	console.log("Logged in with Facebook as:", authData.uid);
	// 	  	$scope.$parent.$parent.userAuthData.uid = authData.uid;
	// 	  	$state.go('update-profile');
	// 	}).catch(function(error) {
	// 	 	console.error("Authentication failed:", error);
	// 	});
	// };


	// ------- SAVE PROFILE INFO ------- //
	$scope.saveProfile = function() {
		console.log("you clicked save");
		var currentUser = currentUserData.getUserData();
		var ref = new Firebase("https://newsily.firebaseio.com/users/" + currentUser.uid);
		ref = $firebaseObject(ref);
		ref.email = $scope.user_email;
		ref.username = $scope.user_email;
		ref.photo = currentUser.password.profileImageURL;
		ref.$save().then(function () {
            console.log(ref);
            // $state.go('create-or-join');
        });
	};



}]); // end app controller


