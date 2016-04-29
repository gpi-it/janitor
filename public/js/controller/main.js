app.controller('mainCtl', ['$scope', '$http', '$location', function($scope, $http, $location, pointService) {
//onImagesLoaded
  $scope.count = {}
  $scope.count.all = 0;
  $scope.count.complete = 0;
  $scope.count.showC = false;
  $scope.count.showA = false;

  $http.get('/api/countAll/').success(function(all) {
    $scope.count.all = all;
    $scope.count.showA = true;
  });
  $http.get('/api/countComplete/').success(function(data) {
    $scope.count.complete = data;
    $scope.count.showC = true;
  });


    // Get the ID of a point which needs to be cleaned and open the clean.html with this param
    $scope.clean = function() {
      $http.get('/api/getSample/').success(function(sample) {
        //console.log(sample.origId);
        $location.path("/clean/" + sample.origId);
      });
    }
    $scope.thanks = ["Dankie", "Dankeschön", "Merci beaucoup", "Dank je wel", "Thank you", "Ευχαριστώ", "Grazie mille", "Muchas gracias", "धन्यवादाः"];
    $scope.randomThanks = $scope.thanks[Math.floor(Math.random() * $scope.thanks.length)];

  }])
  .controller('searchCtl', ['$scope', '$http', '$location', function($scope, $http, $location, pointService) {
    var lastsearched = "";
    var currentsearch = "";
    var timer = 0;
    $scope.searchString = "";

    $scope.every3seconds = function() {
      timer++;
      if ($scope.searchString == "") {
        $scope.searchItems = {};
      }
      if (timer > 10) {
        if (lastsearched != $scope.searchString && $scope.searchString != "") {
          //lastsearched = $scope.searchString;  //moved into search()

          if ($scope.searchString != "") {
            $scope.search();
          }
        } else if ($scope.searchString == "") {
          $scope.searchItems = {};
        }
        timer = 0;
      }
      setTimeout(function() {
        $scope.every3seconds();
      }, 100);
    };

    $scope.every3seconds();

    $scope.search = function() {
      var searchString = '/api/search/' + $scope.searchString;
      lastsearched = $scope.searchString;
      console.log("1: " + $scope.searchString);
      $http.get(searchString).success(function(data) {
        console.log("2: " + $scope.searchString);
        if ($scope.searchString == "") {
          $scope.searchItems = {};
        } else {
        $scope.searchItems = data;
        $scope.showNewButton = true;
        }

      });
    };

    $scope.detail = function(id) {
      console.log(id);
      $location.path("/detail/" + id);
    };

  }])
  .controller('detailCtl', ['$rootScope', '$scope', '$http', '$location', '$routeParams', '$route', 'pointService', '$sce', function($rootScope, $scope, $http, $location, $routeParams, $route, pointService, $sce) {

    //Initialize scope variables
    $scope.readOnly = false; //if readOnly = true, foodpoint cannot be edited
    $scope.showSaveDialog = false;
    $scope.showBackDialog = false;
    $scope.showDeleteDialog = false;
    $scope.moreOpening = false;
    $scope.showSubcategory = false;
    $scope.sections = [false, false, false, false, false, false, false]; //Sets visibility of Sections (all false at the beginning)
    $scope.hello = {}; //object displayed on the website and edited/changed
    $scope.helloOld = {}; //saving the data of the initial foodpoint (to compare with the hello/the changed object)
    var page = ''; //local variable to save the pagename




    //Initialization
    $scope.$on('$routeChangeSuccess', function() {
      //Load the data of the foodpoint into the website
      if ($routeParams.pointId != 'new') { //if the routeparameter is not "new", we get a fpid as parameter
        var searchString = '/api/foodpoints/' + $routeParams.pointId;
        $http.get(searchString).success(function(data) {
          $scope.hello = data;
          $scope.helloOld = angular.copy($scope.hello);
          $scope.checkCategory();
          $scope.findSub();
        });
      };

      //Initialize the page depending on the url
      if ($location.path().indexOf("clean") > -1) { //if the url contains clean
        page = "clean";
        //$scope.readOnly = false;    //already initialized
      } else if ($location.path().indexOf("new") > -1) { //if the url contains new
        page = "new";
        //$scope.readOnly = false;   //already initialized
        $scope.hello = { //load an empty foodpoint object into the page
          "openingHoursSpecification": [{
            "validFrom": "",
            "validThrough": "",
            "description": "",
            "datetime": [{
              "timings": [{
                "closes": "",
                "opens": ""
              }],
              "dayOfWeek": {
                "monday": false,
                "tuesday": false,
                "friday": false,
                "wednesday": false,
                "thursday": false,
                "sunday": false,
                "saturday": false
              }
            }]
          }],
          "instagram": "",
          "twitter": "",
          "telephone": [

          ],
          "hasOfferCatalog": {
            "tourism": false,
            "education": false,
            "CSA": false,
            "sheltered employment": false
          },
          "type": {
            "category": "",
            "subcategory": "",
            "servesCuisine": {
              "vegetarian": false,
              "vegan": false
            }
          },
          "employee": "",
          "email": "",
          "product": {
            "meat": false,
            "eggs": false,
            "fruit": false,
            "dairy": false,
            "bread": false,
            "vegetables": false,
            "drinks": false
          },
          "description": "",
          "facebook": "",
          "address": {
            "addressCountry": "",
            "addressLocality": "",
            "streetAddress": "",
            "postalCode": ""
          },
          "geo": {
            "latitude": 0.0,
            "longitude": 0.0
          },
          "hasPOS": {
            "food_points": [
            ]
          },
          "name": "",
          "url": ""
        };
        $scope.helloOld = angular.copy($scope.hello);
        $scope.checkCategory();
      } else if ($location.path().indexOf("detail") > -1) { //if the url contains detail
        page = "detail";
        $scope.readOnly = true;
      } else {
        console.log("Not sure what page you are on... ");
        $location.path("/"); //go back to main
      }

    });


    /***  Button functions   ***/
    // Button - back button
    $scope.goBack = function() {
      console.log(page);
      console.log("In here");
      if (angular.equals($scope.hello, $scope.helloOld)) { //no changes made, allow to change page
        $scope.changePage();
      } else { //changes made on the website
        $scope.showBackDialog = true;
      }
    };

    //Directing back button to right page depending on where you came from.
    $scope.changePage = function() {
      if (page == "clean" || page == "new") {
        $location.path("/");
      } else if (page == "detail") {
        $location.path("/search/");
      }
    };

    // Save FP / $scope.hello into MongoDB
    $scope.saveFP = function() {
      $http.post('/api/foodpoints/', $scope.hello).success(function(data) {
        console.log("FP added");
        $scope.helloOld = angular.copy($scope.hello); //create a copy of the added FP
      });
    };

    // Button - Save functionality
    $scope.saveEdits = function(status) {
      // Status explanation
      // status = 0: fp has not been edited after scrapying      --> from scrapy
      // status = 1: fp has been edited. Data is not complete.   --> used on submit
      // status = 2: fp has been edited. Data is complete.       --> used on submit
      // status = 3: fp is inactive / has been deleted.         --> from reporting
      if (status == 3){
        console.log("Delete fp");
        $scope.hello.status = status; // assign the new status
        delete $scope.hello._id; // delete unique mongoDB id (new will automatically be created on insert)
        $scope.saveFP(); // save fpData
      } else if (page == "new") { // adding a new point, needs a new fpid
        $scope.hello.status = status; // add the new status
        $http.get('/api/getMaxId/').success(function(data) { // add a new fpid
          console.log(data);
          $scope.hello.fpid = data + 1;
          $scope.saveFP();
        });
      } else { // updating already existing point. Uses same fpid, but needs a new _id
        if (angular.equals($scope.hello, $scope.helloOld)) { //no changes on data
          console.log("Truly the Same, Already Saved");
          if ((status === 2) && ($scope.hello.status !== 2) && (page != "new")) { //change on status (on submit)
            console.log("Change on Status");
            $scope.hello.status = status; // assign the new status
            delete $scope.hello._id; // delete unique mongoDB id (new will automatically be created on insert)
            $scope.saveFP(); // save fpData
          }
        } else { // Data is not the same, save it
          console.log("False different, Save it");
          $scope.hello.status = status; // assign the new status
          delete $scope.hello._id; // delete unique mongoDB id (new will automatically be created on insert)
          $scope.saveFP(); // save fpData
        }
      } // if page != "new"
      //Always go to thank you page
      $location.path("/thankyou");
    };

// Category / Subcategory Select
$scope.findSub = function() {
    angular.forEach($scope.categories, function (value, id) {
      if (value.category==$scope.hello.type.category) {
        $scope.tempSub = value.subcategories;
      }
    });
  };

// Check if category is set --> show subcategory
    $scope.checkCategory = function(){
      // console.log("Calling checkCategory");
      // console.log($scope.showSubcategory);
      // console.log($scope.hello.type.category);
      if ($scope.hello.type.category == ""){
          $scope.showSubcategory = false;
      } else if ($scope.hello.type.category == "farm" || $scope.hello.type.category == "point of sale" || $scope.hello.type.category == "restaurant") {
          $scope.showSubcategory = true;
      } else {
          $scope.showSubcategory = true;
      }
      // console.log($scope.showSubcategory);
    };

  $scope.categories = [
    {
      "category" : "farm",
      "subcategories" : ["transition farm", "organic farm", "organic plus farm"]
    },
    {
      "category" : "point of sale",
      "subcategories" :["farmers\' market","local shop", "deliverypoint"]
    },
    {
      "category" : "restaurant",
      "subcategories" : ["organic restaurant", "organic plus restaurant"]
    }
  ];

    /***  POS functions   ***/
    // POS - Add a POS (Point of Sale) - name and fpid - to $scope
    $scope.addPOS = function(name, id) {
      $scope.hello.hasPOS.food_points.push({
        "name": name,
        "fpid": id
      });
    };

    // POS - Remove a POS (Point of Sale) from $scope
    $scope.removePOS = function(index) {
      $scope.hello.hasPOS.food_points.splice(index, 1);
    }

    // POS - Search Name and biomijnnatuurID
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


    /***  Phone functions   ***/
    // Phone - Add Phone
    $scope.addPhone = function() {
      $scope.hello.telephone.push('');
    };

    // Phone - Remove Phone
    $scope.removePhone = function(index) {
      $scope.hello.telephone.splice(index, 1);
    }

    /***  Openinghours functions   ***/
    // sIndex = season, dIndex = day, tIndex = time

    // Openinghours -  add new Season
    $scope.addNewSeason = function() {
      $scope.hello.openingHoursSpecification.push({
        "validFrom": "",
        "validThrough": "",
        "description": "",
        "datetime": [{
          "timings": [{
            opens: '',
            closes: ''
          }],
          "dayOfWeek": {
            "monday": false,
            "tuesday": false,
            "wednesday": false,
            "thursday": false,
            "friday": false,
            "saturday": false,
            "sunday": false
          }
        }]
      });
    };

    //Openinghours - remove Season
    $scope.remove = function(key, index) {
      $scope.hello[key].splice(index, 1);
    }

    // Openinghours -  add new Day
    $scope.addNewDay = function(sIndex) {
      $scope.hello.openingHoursSpecification[sIndex].datetime.push({
        "timings": [{
          opens: '',
          closes: ''
        }],
        "dayOfWeek": {
          "monday": false,
          "tuesday": false,
          "wednesday": false,
          "thursday": false,
          "friday": false,
          "saturday": false,
          "sunday": false
        }
      });
    };

    // Openinghours -  remove Day
    $scope.removeDay = function(sIndex, dIndex) {
      $scope.hello.openingHoursSpecification[sIndex].datetime.splice(dIndex, 1);
    }

    // Openinghours -  add new Time
    $scope.addNewTime = function(sIndex, dIndex) {
      // Iterating over Seasons and Days - take parentIndex and childIndex
      $scope.hello.openingHoursSpecification[sIndex].datetime[dIndex].timings.push({
        opens: '',
        closes: ''
      });
    };

    // Openinghours -  remove Time
    $scope.removeTime = function(sIndex, dIndex, tIndex) {
      $scope.hello.openingHoursSpecification[sIndex].datetime[dIndex].timings.splice(tIndex, 1);
    }

    // Button - Open Website of the foodpoint in a new Window
    $scope.openWeb = function() {
      console.log($scope.hello.url);
      console.log($scope.hello);
      window.open($scope.hello.url, '_blank'); // <- Open page in a new window.
    };

    // Open Website of the foodpoint in a new Window
    $scope.openUrl = function(key) {
      console.log($scope.hello[key]);
      window.open($scope.hello[key], '_blank'); // <- Open page in a new window.
    };

    $scope.printScope = function() {
      console.log($scope.hello);
    }

  }]);
