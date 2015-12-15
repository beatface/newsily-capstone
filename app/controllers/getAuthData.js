
// app.controller("getAuthData", ["$scope", "$firebaseAuth", "$state", "groupId",
// 	function($scope, $firebaseAuth, $state, groupId) {

// 	console.log("get auth data");

// 	var ref = new Firebase("https://newsily.firebaseio.com/users");

// 	$scope.ref = $firebaseAuth(ref);

// 	var authData = $scope.ref.$getAuth();

// 	console.log("ref", ref);
// 	console.log("scope ref", $scope.ref);
// 	console.log("authData", authData);

// 	// for child controller access
// 	$scope.userAuthData = authData;

// 	if (authData) {
// 	  console.log("Logged in as:", authData.uid);
// 	  var userGroups = new Firebase("https://newsily.firebaseio.com/users/" + authData.uid + "/joined_groups");
// 		  // getting user's joined groups and setting group factory with first group in the array
// 		  userGroups.once("value", function(snapshot) {
// 		  	var groups = snapshot.val();
// 		  	console.log("user groups", groups[0]);
// 			groupId.setGroupId(groups[0]);
// 		  });
// 	  // $state.go('');
// 	} else {
// 	  console.log("Logged out");
// 	  // $state.go('login');
// 	}

// }]); // end app controller