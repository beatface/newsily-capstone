
app.controller("groupCtrl", ["$scope", "$state", "$firebaseArray", "$firebaseObject", "groupId", "currentUserData",
	function($scope, $state, $firebaseArray, $firebaseObject, groupId, currentUserData) {
	
	$scope.newGroupName = "";
	$scope.groupId = "";

	// -- new firebase reference at groups location
	var ref = new Firebase("https://newsily.firebaseio.com/groups");
	fbref = $firebaseArray(ref);

	var currentUser = currentUserData.getUserData();
	console.log("currentUser", currentUser);


	// -- Creates brand new group
	$scope.createGroup = function(state) {
		var joinedref = new Firebase("https://newsily.firebaseio.com/users/" + currentUser.uid + "/joined_groups");
		var groupObj = {
			groupname: $scope.newGroupName,
			members: [currentUser.password.email]
		};
		console.log("groupObj", groupObj);
		var newRef = ref.push(groupObj);
		joinedref.push(newRef.key());
		if (state === 'login') {
			$state.go("add-members");
		} else if (state === 'main') {
			$state.go('newsily-main.posts');
		}
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
		var joinedref = new Firebase("https://newsily.firebaseio.com/users/" + currentUser.uid + "/joined_groups");

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



