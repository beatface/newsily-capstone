
app.controller("mainAppCtrl", ["$scope", "$state", "$firebaseArray", "$http", "groupId", "currentUserData",
	function($scope, $state, $firebaseArray, $http, groupId, currentUserData) {
		console.log("main app ctrl");

	var postsRef = new Firebase("https://newsily.firebaseio.com/posts");
	// setting all posts variable on the scope for loading into partial
	postsRef = $firebaseArray(postsRef);
	$scope.posts = postsRef;
	// console.log("POSTS for filter", $scope.posts);

	var currentUser = currentUserData.getUserData();
	// console.log("currentUser", currentUser.uid);

	$scope.currentGroupView = "";

	// for loading group names into sidebar menu (uses both user's groups and all groups -below- to filter)
	var userGroupsRef = new Firebase("https://newsily.firebaseio.com/users/" + currentUser.auth.uid + "/joined_groups");
	$scope.usersGroups = $firebaseArray(userGroupsRef);
	// console.log("user's groups", $scope.usersGroups);

	// for loading group names into sidebar menu
	var allGroupsRef = new Firebase("https://newsily.firebaseio.com/groups");
	$scope.allGroups = $firebaseArray(allGroupsRef);
	// console.log("all groups", $scope.allGroups);


    // getting user's joined groups and setting group factory with first group in the array
    userGroupsRef.on("value", function(snapshot) {
        var groups = snapshot.val();
        var key = _.findKey(groups);  
        // move one level down in object
        $scope.currentGroupView = groups[key]; // gives the UID string
		console.log("inital group to view", $scope.currentGroupView);
    });


	// Add post to group page
	$scope.addPost = function() {
		console.log("you clicked add post");
		// var currentgroup = groupId.getGroupId();

		$http.get("http://api.embed.ly/1/extract?key=514b5e76363e48c7892110e2bd33a491&url=" + $scope.url + "&maxwidth=500")
		.then(function(data) {
			console.log("data", data);
			var date = new Date();
			// create object for upload with relevant info
			var dataForFirebase = {
				description: data.data.description,
				images: data.data.images,
				url: data.data.original_url,
				title: data.data.title,
				group: $scope.currentGroupView,
				postedat: date
			};
			// push object to posts in firebase
			postsRef.$add(dataForFirebase)
			.then(function(refinfo) {
				console.log("refinfo", refinfo);
			});
		});
	};


	// ----- CLICK FUNCTIONS ON BODY FOR DYNAMICALLY LOADED MENU ITEMS AND POSTS ----- // 
	$('body').click(function(event) {
		// ----- setting iframe source for modal on click
		if ($(event.target).hasClass("viewModal")) {
			console.log("you clicked on a .viewModal element");
			var modalframe = document.getElementById("modaliFrame");
			if(modalframe !== null) {
				if(modalframe.src) {
					modalframe.src = event.target.id; 
				} else if(modalframe.contentWindow !== null && modalframe.contentWindow.location !== null) {
					modalframe.contentWindow.location = event.target.id; 
				} else{ 
					modalframe.setAttribute('src', event.target.id); 
				}
			}
		}
		// ----- setting $scope.selectedGroup on click of menu
	}); // end body click function


	// changing view on click of group menu item
	$scope.changeView = function(selectedID) {
		$scope.currentGroupView = selectedID;
	};


	// ----- LOGOUT BUTTON ----- // 
	$scope.logout = function() {
		userGroupsRef.unauth();
		$state.go("login");
	};



}]); // end app controller








