
app.controller("mainAppCtrl", ["$scope", "$state", "$firebaseObject",
	function($scope, $state, $firebaseObject) {
		console.log("main app ctrl");

	// Add post to group page
	$scope.addPost = function() {

		var refUrl = "https://newsily.firebaseio.com/";
		var userRef = new Firebase(refUrl);
		userRef = $firebaseArray(userRef);

		$scope.urlToSearch = $scope.url;
		console.log("url", $scope.url);
		$http.get("http://api.embed.ly/1/extract?key=514b5e76363e48c7892110e2bd33a491&url=" + $scope.urlToSearch + "&maxwidth=500")
		.then(function(data) {
			console.log("data", data);
			// create object for upload with relevant info
			var dataForFirebase = {
				description: data.data.description,
				images: data.data.images,
				url: data.data.original_url,
				title: data.data.title
			};
			userRef.$add(dataForFirebase)
			.then(function(refinfo) {
				console.log("refinfo", refinfo);
				pinsRef.$add(dataForFirebase)
				.then(function(pinsinfo) {
					console.log("pinsinfo", pinsinfo);
				});
			});

		});




	};




}]); // end app controller