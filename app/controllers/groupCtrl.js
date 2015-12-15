
app.controller("groupCtrl", ["$scope", "$state", "$firebaseArray", "$firebaseObject", "groupId", "currentUserData",
	function($scope, $state, $firebaseArray, $firebaseObject, groupId, currentUserData) {
	
	$scope.newGroupName = "";
	$scope.groupId = "";

	// -- new firebase reference at groups location
	var ref = new Firebase("https://newsily.firebaseio.com/groups");
	ref = $firebaseArray(ref);

	var currentUser = currentUserData.getUserData();
	console.log("currentUser", currentUser);

	// -- Creates brand new group
	$scope.createGroup = function() {
		var groupObj = {
			groupname: $scope.newGroupName,
			members: [currentUser.password.email]
		};
		console.log("groupObj", groupObj);
		ref.$add(groupObj)
		.then(function(newRef) {
			// sets created group id to factory for access from add members iteration of this controller
			groupId.setGroupId(newRef.key());
			// adds group to user's joined-groups key
			var joinedref = new Firebase("https://newsily.firebaseio.com/users/" + currentUser.uid + "/joined_groups");
			// joinedref = $firebaseArray(joinedref);
			joinedref.set([newRef.key()]);
			console.log("added group's key is ", $scope.groupId);
			$state.go("add-members");
		});
	};


	// -- Adds members to newly created group
	$scope.addMembers = function() {
		var group = groupId.getGroupId();
		// -- new firebase reference at groups location
		var ref = new Firebase("https://newsily.firebaseio.com/groups/" + group);
		console.log("ref >>>>>>>>", ref);
		$scope.addedMembers = [$scope.addMember1, $scope.addMember2, $scope.addMember3];

		$scope.addedMembers.forEach(function(element) {
			if (element) {
				ref.child('members').push(element);
			}
		});
		$state.go("newsily-main.posts");
	};

	$scope.joinGroup = function() {
		console.log("you clicked 'Join a group'!");
	};


}]); // end app controller



