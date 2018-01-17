let mongoose = require('mongoose');

//Article schema - setting up Mongoose database?
let foodItemSchema = mongoose.Schema({
  mealType:{
    type: String,
    required: true
  },
  foodName:{
    type: String,
    required: true
  },
  cal:{
    type: Number,
    required: true
  },
  logDate:{
    type: Date,
    default: Date.now,
    required: true
  }
});
// let testArr = mongoose.Schema({
//   logDate: {
//     type: Date,
//     default: Date.now,
//     required: true
//   },
//   foods: [foodItemSchema]
// });
//needs to be singular because Mongoose pluralizes collections
let Food = module.exports = mongoose.model('Food', foodItemSchema);
//let Test = module.exports = mongoose.model('Test', testArr);
