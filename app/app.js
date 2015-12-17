var app = angular.module("NewsilyApp", ["ui.bootstrap", "firebase", "ui.router", "angular.filter"]);

app.config(function($stateProvider, $urlRouterProvider) {

    // $urlRouterProvider.otherwise("/login");

    $stateProvider
        .state('login', {
          url: "/login",
          templateUrl: "app/partials/login.html",
          controller: "loginCtrl"
        })
        .state('update-profile', {
          url: "/update-profile",
          templateUrl: "app/partials/update-profile.html"
        })
        .state('create-or-join', {
          url: "/choose-group",
          templateUrl: "app/partials/create-or-join.html",
          controller: "groupCtrl"
        })
        .state('add-members', {
          url: "/add-members",
          templateUrl: "app/partials/add-members.html"
        })
        .state('newsily-main', {
          url: "/newsily-main",
          templateUrl: "app/partials/main-view.html",
          controller: "mainAppCtrl"
        })
        .state('newsily-main.posts', {
          url: "/newsily-main-posts",
          templateUrl: "app/partials/main-view.posts.html"
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
        currentUserData.setUserData(authData);
        console.log("Logged in as:", authData.uid);
        console.log("current user's data *****", currentUserData.getUserData());
        $state.go("newsily-main.posts");
    } else {
        console.log("Logged out");
        // $state.go('login');
    }

} // end app run


