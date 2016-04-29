var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var cors = require('cors');
var app = express(); //Create the Express app

console.log("APP.JS");

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.options('*', cors());

var foodpoints = require('./routes/foodpoints'); //routes are defined here
//connect to our database
//Ideally you will obtain DB details from a config file
var dbName = 'foodpointDB';

//var db = Mongoose.createConnection('mongodb://USER:PASSWORD@localhost/DATABASE');

//Connection without Authentification
//var connectionString = 'mongodb://localhost:27017/' + dbName;

//Connection with Authentification
var connectionString = 'mongodb://*username*:*password*@localhost:27017/' + dbName;

mongoose.connect(connectionString);

//configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use('/api', foodpoints); //This is our route middleware

console.log("Far down");

module.exports = app;

app.get('/', function(req, res){
  console.log("get /");
  res.render('index.ejs');
});

// app.listen(86);
