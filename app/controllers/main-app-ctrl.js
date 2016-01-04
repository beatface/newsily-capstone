
app.controller("mainAppCtrl", ["$scope", "$state", "$firebaseArray", "$http", "groupId", "currentUserData", "$firebaseObject",
	function($scope, $state, $firebaseArray, $http, groupId, currentUserData, $firebaseObject) {
		console.log("main app ctrl");

	// --- ALL POSTS FROM FIREBASE
	var allPostsRef = new Firebase("https://newsily.firebaseio.com/posts");
	// setting all posts variable on the scope for loading into partial
	allPostsRef.on('value', function(snapshot) {
		console.log("all posts snapshot", snapshot.val());
		$scope.postsObj = snapshot.val();

		$scope.postsArr = [];

		for (var item in $scope.postsObj){
		    $scope.postsArr.push($scope.postsObj[item]);
		}
	});


	// --- ALL FAVOURITES FROM FIREBASE
	var allFavsRef = new Firebase("https://newsily.firebaseio.com/favourites");


	// --- CURRENT USER DATA
	var currentUser = currentUserData.getUserData();
	console.log("currentUser is ---- ", currentUser);
	$scope.currentUserId = currentUser.auth.uid;

	$scope.currentGroupView = "";

	//for accessing user's profile data
	var userProfileData = new Firebase("https://newsily.firebaseio.com/users/" + currentUser.auth.uid);
	userProfileData.on('value', function(snapshot) {
		$scope.currentUserProfileData = snapshot.val();
	});

	// for loading group names into sidebar menu (uses both user's groups and all groups -below- to filter)
	var userGroupsRef = new Firebase("https://newsily.firebaseio.com/users/" + currentUser.auth.uid + "/joined_groups");
	$scope.usersGroups = $firebaseArray(userGroupsRef);

	// for loading group names into sidebar menu
	var allGroupsRef = new Firebase("https://newsily.firebaseio.com/groups");
	$scope.allGroups = $firebaseArray(allGroupsRef);


    // getting user's joined groups and setting group factory with first group in the array for inital page view on login
    userGroupsRef.on("value", function(snapshot) {
        var groups = snapshot.val();
        var key = _.findKey(groups);  
        // move one level down in object
        $scope.currentGroupView = groups[key]; // gives the UID string
		console.log("inital group to view", $scope.currentGroupView);
    });



	// ------- Add post to group page --------- //
	$scope.addPost = function() {
		console.log("you clicked add post");
		var now = new Date();
		// Create an array with the current month, day and time
		var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
		// Create an array with the current hour, minute and second
		var time = [ now.getHours(), now.getMinutes() ];
		// Determine AM or PM suffix based on the hour
		var suffix = ( time[0] < 12 ) ? "AM" : "PM";
		// Convert hour from military time
		time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
		// If hour is 0, set it to 12
		time[0] = time[0] || 12;
		// If seconds and minutes are less than 10, add a zero
		for ( var i = 1; i < 3; i++ ) {
		    if ( time[i] < 10 ) {
		        time[i] = "0" + time[i];
		    }
		}
		// Return the formatted string
		var formattedDate = date.join("/") + " " + time.join(":") + " " + suffix;

		$http.get("http://api.embed.ly/1/extract?key=514b5e76363e48c7892110e2bd33a491&url=" + $scope.url + "&maxwidth=500")
		.then(function(data) {
			// create object for upload with relevant info
			var dataForFirebase = {
				description: data.data.description,
				images: data.data.images,
				url: data.data.original_url,
				title: data.data.title,
				group: $scope.currentGroupView,
				postTimeStamp: new Date().getTime(),
				postDate: formattedDate,
				postedBy: $scope.currentUserProfileData.username,
				postedByUid: currentUser.auth.uid
			};
			// push object to posts in firebase
			allPostsRef.push(dataForFirebase);
			$scope.url = ""; // resets input field to blank
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




	$scope.newComment = "";

	// ----- ADDING COMMENT TO POST'S MODAL ----- //
	$scope.addComment = function(currentpost, newComment) {
		console.log("adding a new comment", currentpost.$id, newComment);

		var now = new Date();
		// Create an array with the current month, day and time
		var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
		// Create an array with the current hour, minute and second
		var time = [ now.getHours(), now.getMinutes() ];
		// Determine AM or PM suffix based on the hour
		var suffix = ( time[0] < 12 ) ? "AM" : "PM";
		// Convert hour from military time
		time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
		// If hour is 0, set it to 12
		time[0] = time[0] || 12;
		// If seconds and minutes are less than 10, add a zero
		for ( var i = 1; i < 3; i++ ) {
		    if ( time[i] < 10 ) {
		        time[i] = "0" + time[i];
		    }
		}
		// Return the formatted string
		var formattedDate = date.join("/") + " " + time.join(":") + " " + suffix;
		var commentObj = {
			content: newComment,
			postedBy: userProfileData.username,
			postDate: formattedDate
		};
		var ref = new Firebase('https://newsily.firebaseio.com/posts/' + currentpost.$id + "/comments");
		refArray = $firebaseArray(ref);
		refArray.$add(commentObj);

		$scope.newComment = ""; // resets input field to blank
	};


	// ------- ADD FAVOURITE ----------- //
	$scope.addFavourite = function(postId) {
		var favouritedRef = new Firebase("https://newsily.firebaseio.com/favourites/");
		var favouriteObj = {
			favPostId: postId, 
			userId: currentUser.auth.uid
		};
		favouritedRef.push(favouriteObj);
	};

	// $scope.removeFavourite = function(index) {
	//   // $scope.favouritePost[index] = false;
	//   console.log("deleting favourite");
	// };


	// ----------- DELETE POST ----------- //
	$scope.deletePost = function(postId) {
		var postRef = new Firebase("https://newsily.firebaseio.com/posts/" + postId);
		var postObj = $firebaseObject(postRef);
		postObj.$remove()
		.then(function(ref) {
			console.log("delete complete", ref);
		}, function(error) {
		    console.log("Error:", error);
		});
	};

	var allPosts;

	allFavsRef.orderByChild('userId').equalTo(currentUser.auth.uid).on('value', function(snapshot) {
		var usersFavs = snapshot.val();
		console.log("snapshot of all users favourites", usersFavs);

		for (var favourite in usersFavs) {
			for (var post in allPosts) {
				if (usersFavs[favourite].favPostId === post) {
					console.log("THIS POST MATCHES === ", usersFavs[favourite].favPostId, post);
					console.log("000000 ==", $scope.posts);
				}
			}
		}
	});

	// finding user's favourited posts
	allPostsRef.on('value', function(snapshot) {
		allPosts = snapshot.val();
		console.log("snapshot of all posts", allPosts);

	});





	// assigns uid to filter variable
	$scope.viewFavourites = function() {
		console.log("all posts ref", allPostsRef);
		console.log("all favs ref", allFavsRef);

	};



	$scope.currentgroup = "";
	// changing view on click of group menu item
	$scope.changeView = function(selectedID) {
		$scope.myFavs = ""; //resets filter variable to null
		$scope.currentGroupView = selectedID;
		groupId.setGroupId(selectedID);
		$scope.currentgroup = "'" + selectedID + "'";
		console.log("current view button click ====", $scope.currentgroup);
	};


	// ----- LOGOUT BUTTON ----- // 
	$scope.logout = function() {
		userGroupsRef.unauth();
		$state.go("login");
	};



}]); // end app controller








