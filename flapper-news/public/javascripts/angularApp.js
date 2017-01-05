var app = angular.module('flapperNews', ['ui.router']); // any time you add an external module, you need to include it as a dependency

app.factory('posts', [function(){
  // service body
  var o = {
    posts: []
  };
  return o;
}])

app.controller('MainCtrl', [
  '$scope', 
  'posts',
  function($scope, posts){
    $scope.test = 'Hello world!';

    $scope.posts = posts.posts;
    // $scope.posts = [
    //   {title: 'post 1', upvotes: 5},
    //   {title: 'post 2', upvotes: 3},
    //   {title: 'post 3', upvotes: 2}
    // ];

    $scope.addPost = function() {
      if ($scope.title === '') { return; }
      $scope.posts.push({
        title: $scope.title,
        link: $scope.link,
        upvotes: 0,
        comments: [
          // {author: 'Joe', body: 'Cool post!', upvotes: 0},
          // {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
        ]
      });
      $scope.title = ''; // clearing out the title after it is submitted
      $scope.link = '';
    }

    $scope.incrementUpvotes = function(post) {
      post.upvotes += 1;
    }
  }
]);

app.controller('PostsCtrl', [
  '$scope',
  '$stateParams',
  'posts',
  function($scope, $stateParams, posts) {
    // use the index as the id/$stateParams will retrieve the id from the url and grab the correct post
    $scope.post = posts.posts[$stateParams.id]; 

    $scope.addComment = function(){
      if($scope.body === '') { return; }
      $scope.post.comments.push({
        body: $scope.body,
        author: 'user',
        upvotes: 0
      });
      $scope.body = '';
    };

    $scope.incrementUpvotes = function(comment) {
      comment.upvotes += 1;
    }
  }
]);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl'
      })

      .state('posts', {
        url: '/posts/{id}', // brackets make id a route parameter, that is available to the controller
        templateUrl: '/posts.html',
        controller: 'PostsCtrl'
      });

    $urlRouterProvider.otherwise('home');
  }
]);