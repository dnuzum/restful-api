var mongoose = require('mongoose');

var CoffeeSchema = mongoose.Schema({
  name: String,
  size: String,
  shots: Number,
  typeOfMilk: String
});

module.exports = mongoose.model('Coffee', CoffeeSchema);