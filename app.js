var app = angular.module('flapperNews', []);

app.controller('MainCtrl', [
'$scope',
function($scope){
  $scope.test = 'Hello world!';

  $scope.posts = [
    {title: 'post 1', upvotes: 5},
    {title: 'post 2', upvotes: 3},
    {title: 'post 3', upvotes: 2}
  ];
}]);