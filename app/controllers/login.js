
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
			return ref.$authWithPassword(userObj);
		    // log user in
		})
		.then(function(authData) {
		  currentUserData.setUserData(authData);
		  console.log("Logged in with email as:", authData.uid);
		})
		.then(function() {
		  // add user data to firebase
		  $scope.saveProfile();
		  $state.go('update-profile');
		}).catch(function(error) {
		  console.error("Error: ", error.code);
            if (error.code == "EMAIL_TAKEN") {
              // case "EMAIL_TAKEN":
              	$scope.message = 'Oh snap! The new user account cannot be created because the email is already in use.';
                console.log("won't work");
            } else if (error.code == "INVALID_EMAIL") {
              // case "INVALID_EMAIL":
                $scope.message = 'Dang! The specified email was invalid. Try again!';
            } else {
              // default:
                $scope.message = 'Oh no! Something went wrong. Try again!' ;
                console.log("another error occurred");
            }
		});
	};


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


