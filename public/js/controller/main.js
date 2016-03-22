app.controller('mainCtl', ['$scope', '$http', '$location', 'pointService', function($scope, $http, $location, pointService) {

    $scope.clean = function() {
      $http.get('/api/getSample/').success(function(sample) {
        console.log(sample.origId);
        $location.path("/clean/" + sample.origId);
      });

    }


  }])
  .controller('searchCtl', ['$scope', '$http', '$location', 'pointService', function($scope, $http, $location, pointService) {
    $scope.search = function() {
      $scope.showNewButton = false;
      if ($scope.searchString != '') {
        var searchString = '/api/search/' + $scope.searchString;
        $http.get(searchString).success(function(data) {
          //console.log(data);
          $scope.searchItems = data;
          $scope.showNewButton = true;
        });
      } else {
        $scope.searchItems = {};
      }
    };

    $scope.detail = function(id) {
      console.log(id);
      $location.path("/detail/" + id);
    };

  }])
  .controller('detailCtl', ['$rootScope', '$scope', '$http', '$location', '$routeParams', '$route', 'pointService', '$sce', function($rootScope, $scope, $http, $location, $routeParams, $route, pointService, $sce) {
    //http://stackoverflow.com/questions/20655877/angularjs-get-current-url-parameters
    //LOAD DATA from Id into page\
    $scope.readOnly = false;
    //console.log($routeParams.pointId);
    $scope.sections = [false, false, false, false, false, false, false];
    $scope.hello = {}
    if ($routeParams.pointId != 'new') {
      var searchString = '/api/foodpoints/' + $routeParams.pointId;
      $http.get(searchString).success(function(data) {
        $scope.hello = data;
        $scope.helloOld = angular.copy($scope.hello);
        //console.log("here");
        //$scope.readOnly = true;
        //console.log($scope.hello);

        //Load data into Iframe
      });
    };

    var page = ''
    if ($location.path().indexOf("clean") > -1) {
      page = "clean";
      $scope.readOnly = false;
    } else if ($location.path().indexOf("new") > -1) {
      page = "new";
      $scope.readOnly = false;
    } else if ($location.path().indexOf("detail") > -1) {
      page = "detail";
      $scope.readOnly = true;
    } else {
      console.log("Not sure what page you are on... ")
    }
    console.log(page);


    //USED COMING FROM CLEAN TO clean.html
    if (page == "clean") {
      $scope.tempurl = $sce.trustAsResourceUrl($scope.hello.url);
    }
    /*
          $rootScope.$on('$routeChangeSuccess', function() {
              });
              */
    $scope.goBack = function() {
      if (page == "clean") {
        $location.path("/");
      } else if (page == "detail") {
        $location.path("/search/");
      }

    };

    $scope.saveEdits = function(status) {
      console.log("ID:");
      console.log($scope.hello.id);
      if (angular.equals($scope.hello, $scope.helloOld)) {
        console.log("Truly the Same, Already Saved");
        if ((status === 2) && ($scope.hello.status != 2)) {
          console.log("Updating Status");
          $scope.hello.status = status;
          delete $scope.hello._id;
          delete $scope.hello.timestamp;
          $http.post('/api/foodpoints/', $scope.hello).success(function(data) {
            console.log("FP added");
            console.log(data);
            $scope.helloOld = angular.copy($scope.hello);
          });
        }
      } else {
        console.log("False different, Save New");

        $scope.hello.status = status;
        delete $scope.hello._id;
        delete $scope.hello.timestamp;

        if ($scope.hello.id == undefined) {
          $http.get('/api/getMaxId/').success(function(data) {
            console.log(data);
            $scope.hello.fpid = data + 1;
            console.log($scope.hello.fpid);
            console.log($scope.hello);

            $http.post('/api/foodpoints/', $scope.hello).success(function(datal) {
              console.log("FP added");
              console.log(datal);
              $scope.helloOld = angular.copy($scope.hello);
            });
          });
        } else {
          $http.post('/api/foodpoints/', $scope.hello).success(function(data) {
            console.log("FP added");
            console.log(data);
            $scope.helloOld = angular.copy($scope.hello);
          });

        }

      }

    };


    $scope.confirm = function() {
      var newJson = angular.copy($scope.hello);
      console.log(newJson);
    };

    $scope.add = function(key) {

      $scope.hello[key].push('');
      console.log("ParentIndex:" + key);
    }

    $scope.addOpening = function(key) {
      $scope.hello[key].push({
        "@type": "openingHoursSpecification",
        "validFrom": "",
        "validThrough": "",
        "description": "",
        "dayOfWeek": {
          "monday": false,
          "tuesday": false,
          "wednesday": false,
          "thursday": false,
          "friday": false,
          "saturday": false,
          "sunday": false
        },
        "timings": []
      });
    }

    $scope.addTiming = function(key) {
      console.log("TimingIndex:" + key);
      $scope.hello.openingHoursSpecification[key].timings.push({
        opens: '',
        closes: ''
      });
    }

    $scope.addPOS = function(name, id) {
      var newFarm = {
        "name": name,
        "id": id
      };
      $scope.hello.hasPOS.food_points.push(newFarm);
    }

    $scope.remove = function(key, index) {
      console.log($scope.hello[key]);
      console.log("Key:" + key);
      console.log("Index:" + index);
      $scope.hello[key].splice(index, 1);
    }

    $scope.removePOS = function(index) {
      $scope.hello.hasPOS.food_points.splice(index, 1);
    }

    $scope.removeTiming = function(pIndex, cIndex) {
      console.log("Key:" + pIndex);
      console.log("Index:" + cIndex);
      console.log($scope.hello.openingHoursSpecification[pIndex].timings);
      $scope.hello.openingHoursSpecification[pIndex].timings.splice(cIndex, 1);
    }

    $scope.searchNameID = function() {
      if ($scope.searchNameIDString != '') {
        var searchString = '/api/searchNameID/' + $scope.searchNameIDString;

        $http.get(searchString).success(function(data) {
          console.log(data);
          $scope.searchNameIDItems = data;
        });
      } else {
        $scope.searchNameIDItems = {};
      }
    };

    //$scope.myLink = $sce.trustAsResourceUrl('http://www.google.com');
    /*
    $scope.$watch('showName', function(){
      console.log("CHANGE");
        $scope.showNameText = $scope.showName ? '-!' : '+';
    })
    */



  }]);
