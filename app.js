//declare constants
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const ProgressBar = require('progressbar.js');
const config = require('./config/database');
const moment = require('moment');
//initiate global variables
var calCount=0;
var calGoal=2000;
mongoose.connect(config.database);
//mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

//check for DB errors
db.on('error', function(err){
  console.log(err);
});

//init app
const app = express();
app.locals.moment=require('moment');
//bring in models (give pathname)
let Food = require('./models/foodItem');

//BODY PARSEr MIDDLEWARE
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
//
//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));
//
// //Express Session MIDDLEWARE
// app.use(session({
//   secret: 'keyboard cat',
//   resave: true,
//   saveUninitialized: true,
//   //cookie: { secure: true }
// }));
//
// //Express Messages MIDDLEWARE
// app.use(require('connect-flash')());
// app.use(function (req, res, next) {
//   res.locals.messages = require('express-messages')(req, res);
//   next();
// });
//
// //Express Validator MIDDLEWARE
// app.use(expressValidator({
//   errorFormatter: function(param, msg, value){
//     var namespace = param.split('.'),
//     root = namespace.shift(),
//     formParam = root;
//
//   while(namespace.length) {
//     formParam += '[' + namespace.shift() + ']';
//   }
//   return {
//     param: formParam,
//     msg : msg,
//     value: value
//   };
//   }
// }));
//
//
// //home route
// app.get('/', function(req, res){
//   //call all articles
//   Article.find({}, function(err, articles){
//     if(err){
//       console.log(err);
//     }
//     else{
//       res.render('index', {
//         title: 'Articles',
//         articles: articles
//
//       });
//   }
//   });
// });
//
// //route files
// let articles = require('./routes/events');
// app.use('/articles', articles);

//MY CODE
//color array for nav background
var colorArr = [
  'red darken-1',
  'red darken-2',
  'pink darken-1',
  'pink darken-2',
  'purple darken-1',
  'purple darken-2',
  'blue darken-1'
];

//main code
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//home page route
app.get('/', function(req,res){
  var rand = Math.floor(Math.random() * colorArr.length);
  //load index.pug
  res.render('index', {
    //give home page title of 'MicroTrack'
    title: 'MicroTrack',
    navColor: colorArr[rand]
  });
});

//route files
let foods = require('./routes/foods');
app.use('/diet', foods);


//start server
app.listen(3000, function(){
  console.log("Server started on port 3000...");
});
