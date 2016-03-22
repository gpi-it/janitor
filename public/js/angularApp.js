//$(document).foundation();

var app = angular.module('volApp',['ngRoute','ngResource']);

app.config(function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
})

.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/main', {
      templateUrl:'tmp/main.html',
      controller:'mainCtl'
  })
  .when('/search',{
    templateUrl:'tmp/search.html',
    controller:'searchCtl'
  })
  .when('/compare/:idOne/:idTwo',{
    templateUrl:'tmp/compare.html',
    controller:'mainCtl'
  })
  .when('/clean/:pointId',{
    templateUrl:'tmp/clean.html',
    controller:'detailCtl'
  })
  .when('/detail/:pointId',{
    templateUrl:'tmp/detail.html',
    controller:'detailCtl'
  })
  .when('/edit/:pointId',{
    template:'tmp/edit.html',
    controller:'detailCtl'
  })
  .otherwise('/main');

  //$locationProvider.html5Mode(true);
});
