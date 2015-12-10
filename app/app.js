var app = angular.module("NewsilyApp", ["ui.bootstrap", "firebase", "ui.router"]);

app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/login");

  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: "app/partials/login.html",
      controller: "loginCtrl"
    })
    .state('create-or-join', {
      url: "/choose-group",
      templateUrl: "app/partials/create-or-join.html",
      controller: "groupCtrl"
    });
});
