
app.controller("groupCtrl", ["$scope", "$state", "$firebaseArray", "$firebaseObject", "groupId", "currentUserData",
	function($scope, $state, $firebaseArray, $firebaseObject, groupId, currentUserData) {
	
	$scope.newGroupName = "";
	$scope.groupId = "";

	// -- new firebase reference at groups location
	var ref = new Firebase("https://newsily.firebaseio.com/groups");
	fbref = $firebaseArray(ref);

	var currentUser = currentUserData.getUserData();
	console.log("currentUser", currentUser);

	var joinedref = new Firebase("https://newsily.firebaseio.com/users/" + currentUser.uid + "/joined_groups");

	// -- Creates brand new group
	$scope.createGroup = function() {
		var groupObj = {
			groupname: $scope.newGroupName,
			members: [currentUser.password.email]
		};
		console.log("groupObj", groupObj);
		fbref.$add(groupObj)
		.then(function(newRef) {
			// sets created group id to factory for access from add members iteration of this controller
			groupId.setGroupId(newRef.key());
			// adds group to user's joined-groups key
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
		var groupref = new Firebase("https://newsily.firebaseio.com/groups/" + group);
		console.log("groupref >>>>>>>>", groupref);
		$scope.addedMembers = [$scope.addMember1, $scope.addMember2, $scope.addMember3];
		// loop through added members and push to members in firebase 
		$scope.addedMembers.forEach(function(element) {
			if (element) {
				groupref.child('members').push(element);
			}
		});
		$state.go("newsily-main.posts");
	};

	// -- Join an existing from from create-or-join onboarding view 
	$scope.joinGroup = function() {

		ref.orderByChild("groupname").equalTo($scope.joinGroupName).on('value', function(snapshot) {
			console.log("snapshot", snapshot.val());
			var matched_group = snapshot.val();
			// check that group exists
			if ( matched_group !== null && matched_group !== undefined ) {
				// get group's key
				var key = _.findKey(matched_group, 'members');	
				// move one level down in object
				var obj = matched_group[key];
				// target members on group to join
				for (var member in obj.members) {
					console.log("this member", obj.members[member]);
					// find if current user matches authorized group members
					if ( obj.members[member] === currentUser.password.email ) {
						console.log("this group matches", obj.members[member], "--", currentUser.password.email);
						// push joined group key to user's joined_groups
						joinedref.push(key);
						//reroute to main view
						$state.go('newsily-main.posts');
					}
				}
			} //end if
			
		});
	};


}]); // end app controller



