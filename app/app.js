var app = angular.module("NewsilyApp", ["ui.bootstrap", "firebase", "ui.router"]);

app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/login");

    $stateProvider
        .state('login', {
          url: "/login",
          templateUrl: "app/partials/login.html",
          controller: "loginCtrl"
        })
        .state('update-profile', {
          url: "/update-profile",
          templateUrl: "app/partials/update-profile.html",
          controller: "loginCtrl"
        })
        .state('create-or-join', {
          url: "/choose-group",
          templateUrl: "app/partials/create-or-join.html",
          controller: "groupCtrl"
        })
        .state('add-members', {
          url: "/add-members",
          templateUrl: "app/partials/add-members.html",
          controller: "groupCtrl"
        })
        .state('newsily-main', {
          url: "/newsily-main",
          templateUrl: "app/partials/main-view.html",
          controller: "mainAppCtrl"
        })
        .state('newsily-main.posts', {
          url: "/newsily-main-posts",
          templateUrl: "app/partials/main-view.posts.html",
          controller: "mainAppCtrl"
    });
});

angular
    .module('NewsilyApp')
    .run(auth);

function auth($firebaseAuth, $state, groupId, currentUserData) {
    var ref = new Firebase("https://newsily.firebaseio.com/users");
    ref = $firebaseAuth(ref);
    var authData = ref.$getAuth();

    if (authData) {
        console.log("Logged in as:", authData.uid);
        currentUserData.setUserData(authData);
        var userGroups = new Firebase("https://newsily.firebaseio.com/users/" + authData.uid + "/joined_groups");
        // getting user's joined groups and setting group factory with first group in the array
        userGroups.once("value", function(snapshot) {
            var groups = snapshot.val();
            console.log("user groups", groups[0]);
            groupId.setGroupId(groups[0]);
        });
        // $state.go('');
    } else {
        console.log("Logged out");
        // $state.go('login');
    }

} // end app run


