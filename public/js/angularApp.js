//$(document).foundation();

var app = angular.module('volApp',['ngRoute','ngResource', 'angular-datepicker']);

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
  .when('/clean/:pointId',{
    templateUrl:'tmp/detail.html',
    controller:'detailCtl'
  })
  .when('/detail/:pointId',{
    templateUrl:'tmp/detail.html',
    controller:'detailCtl'
  })
  .when('/thankyou',{
      templateUrl:'tmp/thankyou.html',
      controller:'mainCtl'
    })
  .otherwise('/main');

  //$locationProvider.html5Mode(true);
});
