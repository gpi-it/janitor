var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var foodpointSchema = new Schema({}, {strict: false});

module.exports = mongoose.model('Foodpoint', foodpointSchema);
