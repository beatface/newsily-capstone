
app.controller("mainAppCtrl", ["$scope", "$state", "$firebaseArray", "$http", "groupId",
	function($scope, $state, $firebaseArray, $http, groupId) {
		console.log("main app ctrl");

	var postsRef = new Firebase("https://newsily.firebaseio.com/posts");
	// setting all posts variable on the scope for loading into partial
	postsRef = $firebaseArray(postsRef);
	$scope.posts = postsRef;

	var userGroupsRef = new Firebase("https://newsily.firebaseio.com/users/" + $scope.$parent.userAuthData.uid + "/joined_groups");
	$scope.userGroups = $firebaseArray(userGroupsRef);
	console.log("userGroupsRef", $scope.userGroups);


	// Add post to group page
	$scope.addPost = function() {
		console.log("you clicked add post");
		var currentgroup = groupId.getGroupId();

		$http.get("http://api.embed.ly/1/extract?key=514b5e76363e48c7892110e2bd33a491&url=" + $scope.url + "&maxwidth=500")
		.then(function(data) {
			console.log("data", data);
			// create object for upload with relevant info
			var dataForFirebase = {
				description: data.data.description,
				images: data.data.images,
				url: data.data.original_url,
				title: data.data.title,
				group: currentgroup
			};
			console.log("dataForFirebase", dataForFirebase);
			postsRef.$add(dataForFirebase)
			.then(function(refinfo) {
				console.log("refinfo", refinfo);
				// pinsRef.$add(dataForFirebase)
				// .then(function(pinsinfo) {
				// 	console.log("pinsinfo", pinsinfo);
				// });
			});
		});
	};

	// setting iframe source for modal on click
	$('body').click(function(event) {
		// console.log("event target >>> ", event.target);
		if ($(event.target).hasClass("viewModal")) {
			console.log("you clicked on a .viewModal element");
			var myframe = document.getElementById("modaliFrame");
			if(myframe !== null) {
				if(myframe.src) {
					myframe.src = event.target.id; 
				} else if(myframe.contentWindow !== null && myframe.contentWindow.location !== null) {
					myframe.contentWindow.location = event.target.id; 
				} else{ 
					myframe.setAttribute('src', event.target.id); 
				}
			}
		}
	});

	//logout button
	$scope.logout = function() {
		$scope.$parent.ref.$unauth();
		$state.go("login");
	};



}]); // end app controller








