
app.controller("mainAppCtrl", ["$scope", "$state", "$firebaseArray", "$http", "groupId",
	function($scope, $state, $firebaseArray, $http, groupId) {
		console.log("main app ctrl");

	var postsRef = new Firebase("https://newsily.firebaseio.com/posts");
	postsRef = $firebaseArray(postsRef);

	// setting all posts variable on the scope for loading into partial
	$scope.posts = postsRef;

	$(document).ready(function(){
    	$('[data-toggle="popover"]').popover(); 
	});

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




}]); // end app controller