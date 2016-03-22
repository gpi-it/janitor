var Foodpoint = require('../models/foodpoint');
var express = require('express');
var router = express.Router();


router.route('/foodpoints').get(function(req, res) {
  Foodpoint.find(function(err, foodpoints) {
    if (err) {
      return res.send(err);
    }

    res.json(foodpoints);
  });
});

router.route('/foodpoints').post(function(req, res) {
  var foodpoint = new Foodpoint(req.body);

  foodpoint.save(function(err) {
    if (err) {
      return res.send(err);
    }

    res.send({
      message: 'Foodpoint Added'
    });
  });
});

router.route('/foodpoints/:id').put(function(req, res) {
  Foodpoint.findOne({
    _id: req.params.id
  }, function(err, foodpoint) {
    if (err) {
      return res.send(err);
    }

    for (prop in req.body) {
      foodpoint[prop] = req.body[prop];
    }

    // save the foodpoint
    foodpoint.save(function(err) {
      if (err) {
        return res.send(err);
      }

      res.json({
        message: 'Foodpoint updated!'
      });
    });
  });
});

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

router.route('/getSample').get(function(req, res) {
  Foodpoint.aggregate(
      [{
        $sort: {
          fpid: 1,
          status: -1,
          _id: -1,
          name: 1
        }
      }, {
        $group: {
          _id: "$fpid",
          status: {
            $first: "$status"
          },
          origId: {
            $first: "$_id"
          },
          name: {
            "$first": "$name"
          }
        }
      }, {
        $match: {
          "status": {
            $ne: 2
          }
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

router.route('/getMaxId').get(function(req, res) {
  Foodpoint.aggregate([{$group: {_id: "$item", maxid : {$max : "$fpid"}}}],
    function(err, maxId) {
      if (err) {
        return res.send(err);
      }
      res.json(maxId[0].maxid);
    });
});

router.route('/searchNameID/:searchString').get(function(req, res) {
  var re = new RegExp(req.params.searchString, "ig");

  Foodpoint.aggregate(
    [{
      $match: {
        $and: [{
          $or: [{
            name: re
          }, {
            biomijnnatuurID: re
          }]
        }, {
          status: {
            $ne: -1
          }
        }]
      }
    }, {
      $sort: {
        fpid: 1,
        status: -1,
        _id: -1,
        name: 1
      }
    }, {
      $group: {
        _id: "$fpid",
        status: {
          $first: "$status"
        },
        timestamp: {
          "$first": "$timestamp"
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
        }
      }
    }, {
      $sort: {
        name: 1
      }
    }],
    function(err, foodpoint) {
      if (err) {
        return res.send(err);
      }




      /*
            Foodpoint.find( {$or: [{"name" : re}, {"biomijnnatuurID" : re} ]}, { name: true, _id : true, status: true, "address" : true, biomijnnatuurID: true }, function(err, foodpoint) {
              if (err) {
                return res.send(err);
              }

      */
      res.json(foodpoint);
    });
});

router.route('/search/:searchString').get(function(req, res) {
  var re = new RegExp(req.params.searchString, "ig");
  Foodpoint.aggregate(
    [{
      $match: {
        $and: [{
          $or: [{
            name: re
          }, {
            "address.addressLocality": re
          }]
        }, {
          status: {
            $ne: -1
          }
        }]
      }
    }, {
      $sort: {
        fpid: 1,
        status: -1,
        _id: -1,
        name: 1
      }
    }, {
      $group: {
        _id: "$fpid",
        status: {
          $first: "$status"
        },
        timestamp: {
          "$first": "$timestamp"
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
        }
      }
    }, {
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

module.exports = router;
