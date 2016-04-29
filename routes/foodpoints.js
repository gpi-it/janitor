var Foodpoint = require('../models/foodpoint');
var express = require('express');
var router = express.Router();

// Add / Post a new foodpoint to the dDB
router.route('/foodpoints').post(function(req, res) {
  var foodpoint = new Foodpoint(req.body);  //define foodpoint as Foodpoint (the schema defined in models/foodpoint.js) in req.body (eg. raw json in postman)

  foodpoint.save(function(err) {  //save new point to MongoDB
    if (err) {
      return res.send(err); //return error on fail
    }

    res.send({    //return "Foodpoint Added" on success
      message: 'Foodpoint Added'
    });
  });
});

// Get the data of a foodpoint with a specific ID
router.route('/foodpoints/:id').get(function(req, res) {
  Foodpoint.findOne({
    _id: req.params.id
  }, function(err, foodpoint) {
    if (err) {
      return res.send(err);
    }

    res.json(foodpoint);
  });
});

// For clean
// Get the latest version of a foodpoint, whose status is not 2 and not 3
router.route('/getSample').get(function(req, res) {
  Foodpoint.aggregate(
      [{
        $sort: {    //Sorting by fpid (our not-unique foodpoint)
          fpid: 1,
          status: -1, // status 3,2,1,0
          _id: -1    // works as timestamp, newest first, if there are several with same status
        }
      }, {
        $group: {       // Group by fpid
          _id: "$fpid",
          status: {
            $first: "$status"     // Use the status of the first element in the group
          },
          origId: {
            $first: "$_id"
          },
          name: {
            "$first": "$name"
          }
        }
      }, {
        $match: {           // make sure that the element has not status 2 (complete point) or 3 (deleted point)
            $or: [{
            "status": {
            $ne: 2
          }
          }, {
            "status": {
            $ne: 3
          }
          }]

        }
      }, {
        $sample: {
          size: 1
        }
      }],
    function(err, foodpoint) {
      if (err) {
        return res.send(err);
      }
      res.json(foodpoint[0]);
    });
});



// Get the Maximum ID used in the DB (to afterwards insert a point with an ID +1 higher)
router.route('/getMaxId').get(function(req, res) {
  Foodpoint.aggregate([{$group: {_id: "$item", maxid : {$max : "$fpid"}}}],  // group all points and return the max of fpid
    function(err, maxId) {
      if (err) {
        return res.send(err);
      }
      res.json(maxId[0].maxid);
    });
});

// Used in detail.ctl to link POS (point of sale)
// Search by Name of the fp and biomijnnatuurID
router.route('/searchNameID/:searchString').get(function(req, res) {
  var re = new RegExp(req.params.searchString, "ig");  // i = ignore case (capitals), g = global (not only starting at beginning)

  Foodpoint.aggregate(
    [{
      $match: {
          $or: [{
            "name": re    //match name
          }, {
            biomijnnatuurID: re     // or biomijnnatuurID
          }]
      }
    }, {
      $sort: {
        fpid: 1,
        status: -1,
        _id: -1
      }
    }, {
      $group: {
        _id: "$fpid",
        status: {
          "$first": "$status"
        },
        origId: {
          "$first": "$_id"
        },
        name: {
          "$first": "$name"
        },
        address: {
          "$first": "$address"
        },
        biomijnnatuurID: {
          "$first": "$biomijnnatuurID"
        },
        type: {
          "$first": "$type"
        }
      }
    }, {
      $match: {       //make sure that the status of the group is not 3 (point deleted)
          status: {
            $ne: 3
          }
        }
    } ,
    {
      $sort: {
        name: 1
      }
    }],
    function(err, foodpoint) {
      if (err) {
        return res.send(err);
      }
      res.json(foodpoint);
    });
});

// Used in Search / search.html
// Search in Name and addressLocality/City
router.route('/search/:searchString').get(function(req, res) {
  var re = new RegExp(req.params.searchString, "ig");  // i = ignore case (capitals), g = global (not only starting at beginning)
  Foodpoint.aggregate(
    [{
      $match: {
          $or: [{
            "name": re  // match name
          }, {
            "address.addressLocality": re   // or city
          }]
      }
    }, {
      $sort: {
        fpid: 1,
        status: -1,
        _id: -1
      }
    }, {
      $group: {
        _id: "$fpid",
        status: {
          "$first": "$status"
        },
        origId: {
          "$first": "$_id"
        },
        name: {
          "$first": "$name"
        },
        address: {
          "$first": "$address"
        },
        biomijnnatuurID: {
          "$first": "$biomijnnatuurID"
        },
        type: {
          "$first": "$type"
        }
      }
    }, {
      $match: {
          status: {   // make sure that the status is not 3 (point deleted)
            $ne: 3
          }
        }
    } ,
    {
      $sort: {
        name: 1
      }
    }],
    function(err, foodpoint) {
      if (err) {
        return res.send(err);
      }

      res.json(foodpoint);
    });
});

// Count All Points
router.route('/countAll').get(function(req, res) {
  Foodpoint.aggregate([{

      $sort: {
        fpid: 1,
        status: -1,
        _id: -1
      }
    }, {
      $group: {
        _id: "$fpid",
        status: {
          "$first": "$status"
        }
      }
    },{
        $match: {
            status: { $ne: 3}
      }},
    {
      $group: {
        _id: "item",
        sum: {
          "$sum": 1
        }
      }
    }

    ], function(err, foodpoint) {
    if (err) {
      return res.send(err);
    }

    res.json(foodpoint[0].sum);
  });
});

// Count Complete Points
router.route('/countComplete').get(function(req, res) {
  Foodpoint.aggregate([{

      $sort: {
        fpid: 1,
        status: -1,
        _id: -1
      }
    }, {
      $group: {
        _id: "$fpid",
        status: {
          "$first": "$status"
        }
      }
    },{
      $match: {
          status: { $eq: 2}
      }
    },{
      $group: {
        _id: "item",
        sum: {
          "$sum": 1
        }
      }
    }], function(err, foodpoint) {
    if (err) {
      return res.send(err);
    }else if (foodpoint.length == 0) {
      res.json(0);
    } else {
    res.json(foodpoint[0].sum);
  }
  });
});

// Get points in GeoRange
router.route('/getGeoRange/').post(function(req, res) {
console.log("HELLO");
console.log(req.body);

  /*
  {
    "upperLeft":{
      "lat": 50.0,
      "lng": 4.0
    },
    "lowerRight":{
    "lat": 51.0,
    "lng": 4.5
    }
  }
  */

   var lat1 = parseFloat(req.body.upperLeft.lat);
   var lat2 = parseFloat(req.body.lowerRight.lat);
   var long1 = parseFloat(req.body.upperLeft.lng);
   var long2 = parseFloat(req.body.lowerRight.lng);
  Foodpoint.aggregate(
    [{
      $match: {
          $and: [{
            "geo.latitude": { $gt: lat1, $lt: lat2}  // match name
          }, {
            "geo.longitude": { $gt: long1, $lt: long2}   // or city
          }]
      }
    }, {
      $sort: {
        fpid: 1,
        status: -1,
        _id: -1
      }
    }, {
      $group: {
        _id: "$fpid",
        status: {
          "$first": "$status"
        },
        geo: {
          "$first": "$geo"
        },
        category: {
          "$first": "$type.category"
        }
      }
    }, {
      $match: {
          status: {   // make sure that the status is not 3 (point deleted)
            $ne: 3
          }
        }
    } ,
    {
        $sample: {
          size: 20
        }
    }], function(err, foodpoint) {
    if (err) {
      return res.send(err);
    }

    res.json(foodpoint);
  });
});

// Functioality from first API
/*
// Get all foodpoints in the DB
router.route('/foodpoints').get(function(req, res) {
  Foodpoint.find(function(err, foodpoints) {  //find (without argument) all point in the DB
    if (err) {
      return res.send(err);
    }

    res.json(foodpoints); //get the result as a json in res
  });
});

// Update a foodpoint using its id
router.route('/foodpoints/:id').put(function(req, res) {
  Foodpoint.findOne({   // find a single point
    _id: req.params.id  //with this id
  }, function(err, foodpoint) {
    if (err) {
      return res.send(err);
    }

    for (prop in req.body) {  // add the new data (req.body) to the old data (foodpoint)
      foodpoint[prop] = req.body[prop];
    }

    // save the foodpoint
    foodpoint.save(function(err) { //save the updated foodpoint
      if (err) {
        return res.send(err);
      }

      res.json({
        message: 'Foodpoint updated!'
      });
    });
  });
});

// Delete a point from the records
router.route('/foodpoints/:id').delete(function(req, res) {
  Foodpoint.remove({
    _id: req.params.id
  }, function(err, foodpoint) {
    if (err) {
      return res.send(err);
    }

    res.json({
      message: 'Successfully deleted'
    });
  });
});

*/

module.exports = router;
