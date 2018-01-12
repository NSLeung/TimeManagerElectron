let mongoose = require('mongoose');

//Article schema - setting up Mongoose database?
let eventSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});

let Article = module.exports = mongoose.model('Event', eventSchema);
