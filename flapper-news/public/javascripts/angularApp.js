var app = angular.module('flapperNews', ['ui.router']); // any time you add an external module, you need to include it as a dependency

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl',
        resolve: {
          postPromise: ['posts', function(posts){
            return posts.getAll();
          }]
        }
      })

      .state('posts', {
        url: '/posts/{id}', // brackets make id a route parameter, that is available to the controller
        templateUrl: '/posts.html',
        controller: 'PostsCtrl',
        resolve: {
          post: ['$stateParams', 'posts', function($stateParams, posts) {
            return posts.get($stateParams.id);
          }]
        }
      });

    $urlRouterProvider.otherwise('home');
  }
]);

app.factory('posts', ['$http',
  function($http) {
    var o = {
      posts : []
    };

    // getAll() to retrieve posts in the posts service within angularApp.js
    o.getAll = function() {
      return $http.get('/posts').success(function(data){
        angular.copy(data, o.posts);
      });
    };

    o.create = function(post) {
      return $http.post('/posts', post).success(function(data){
        o.posts.push(data);
      });
    };

    o.upvote = function(post) {
      return $http.put('/posts/' + post._id + '/upvote')
        .success(function(data){
          post.upvotes += 1;
        });
    };

    o.get = function(id) {
      return $http.get('/posts/' + id).then(function(res){
        return res.data;
      });
    };

    o.addComment = function(id, comment) {
      return $http.post('/posts/' + id + '/comments', comment);
    };

    o.upvoteComment = function(post, comment) {
      return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote')
        .success(function(data){
          comment.upvotes += 1;
        });
    };

    return o;
  }
]);

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
      if (!$scope.title || $scope.title === '') { return; }
      posts.create({
        title: $scope.title,
        link: $scope.link,
        // upvotes: 0,
        // comments: [
        //   // {author: 'Joe', body: 'Cool post!', upvotes: 0},
        //   // {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
        // ]
      });
      $scope.title = ''; // clearing out the title after it is submitted
      $scope.link = '';
    }

    $scope.incrementUpvotes = function(post) {
      posts.upvote(post);
    };
  }
]);

app.controller('PostsCtrl', [
  '$scope',
  '$stateParams',
  'posts',
  'post',
  function($scope, $stateParams, posts, post) {
    // use the index as the id/$stateParams will retrieve the id from the url and grab the correct post
    // $scope.post = posts.posts[$stateParams.id]; 
    $scope.post = post;

    // $scope.addComment = function(){
    //   if($scope.body === '') { return; }
    //   $scope.post.comments.push({
    //     body: $scope.body,
    //     author: 'user',
    //     upvotes: 0
    //   });
    //   $scope.body = '';
    // };
    $scope.addComment = function(){
      if($scope.body === '') { return; }
      posts.addComment(post._id, {
        body: $scope.body,
        author: 'user',
      }).success(function(comment) {
        $scope.post.comments.push(comment);
      });
      $scope.body = '';
    };

    $scope.incrementUpvotes = function(comment){
      posts.upvoteComment(post, comment);
    };
  }
]);