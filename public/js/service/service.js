
app.service('pointService',['$http', '$location', function($http, $location){

/*
  var hello={};
  this.init = function (helloStr) {
    hello=helloStr;
  };



  this.confirm = function() {
    var newJson = angular.copy(hello);

    console.log(newJson);
  };

  this.add = function (key) {

    hello[key].push('');
    console.log("ParentIndex:" + key);
  }

  this.addOpening = function (key) {

    hello[key].push(
      {
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
        "timings":[]
      }
    );
  }

  this.addTiming = function (key) {
    console.log("TimingIndex:" + key);
    hello.openingHoursSpecification[key].timings.push({opens:'', closes: ''});
  }

  this.addPOS = function (name, id) {
    var newFarm = {"name" : name, "id" : id};
    hello.hasPOS.food_points.push(newFarm);
  }

  this.remove = function (key, index) {
      console.log(hello[key]);
      console.log("Key:" + key);
      console.log("Index:" + index);
    hello[key].splice(index, 1);
  }

  this.removePOS = function (index) {
    hello.hasPOS.food_points.splice(index, 1);
  }

  this.removeTiming = function (pIndex, cIndex) {
    console.log("Key:" + pIndex);
    console.log("Index:" + cIndex);
    console.log(hello.openingHoursSpecification[pIndex].timings);
    hello.openingHoursSpecification[pIndex].timings.splice(cIndex, 1);
}

  this.searchNameID = function() {
   if (this.searchNameIDString!='') {
     var searchString = '/api/searchNameID/' + this.searchNameIDString;

     $http.get(searchString).success(function (data) {
       console.log(data);
       this.searchNameIDItems = data;
     });
   }else {
     this.searchNameIDItems={};
   }
  };


  this.setHello = function(id) {
    var searchString = '/api/foodpoints/' + id;
    $http.get(searchString).success(function (data) {
      console.log(data);
    return data;
    });
  };

  */


}]);
