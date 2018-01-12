//declare constants
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const ProgressBar = require('progressbar.js');


//initiate global variables
var calCount=0;
var calGoal=2000;
mongoose.connect('mongodb://localhost/microtrack');
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

//bring in models (give pathname)
let Food = require('./models/foodItem');

//BODY PARSEr MIDDLEWARE
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
//
// //Set Public Folder
// app.use(express.static(path.join(__dirname, 'public')));
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
//diet page route (access by adding route /diet at the end of server url)
app.get('/diet', function(req,res){
  var rand = Math.floor(Math.random() * colorArr.length);
  Food.find({}, function(err, foods){
    //reverse array to get most recent foods at beginning of array
    foods = foods.reverse();
    //compute total calorie calCount
    //reset calCount everytime computation is made
    calCount=0;
    for(var i=0;i<foods.length;i++){
      calCount+=foods[i].cal;
      //console.log('food'+i+ ' '+foods[i].foodName);
    }

    //toggle view history button (if food array has more than 2 food items), true = show, false=hide
    var toggleHistory = false;
    var showHistory ='';
    if(foods.length>2){
      toggleHistory=true;
      showHistory ='';
    }
    else{
      showHistory= 'display: none;'
    }
    if(err){
      console.log(err);
    }
    else{
      //load diet.pug, send values
      res.render('diet', {
        title: 'Diet',
        calCount: calCount,
        calGoal: calGoal,
        //only list first 2 (recent) items in food array (don't want to make user scroll a lot)
        foods: [
          foods[0],
          foods[1]
        ],
        food:{},
        //css props
        navColor: colorArr[rand],
        modalType: {
          breakfast:'dietModalAddBreakfast',
          lunch:'dietModalAddLunch',
          dinner:'dietModalAddDinner'
        },
        sideIcon: 'pageview',
        imgSrc: {
          breakfast: '/images/if_food-drink-04_809027.png',
          lunch: '/images/if_food-drink-28_809014.png',
          dinner: '/images/if_food-drink-03_809028.png'
        },
        iconbool: '',
        dispbool: {
          breakfast: 'padding: 3px;padding-right: 4px;',
          dinner: 'padding-top: 2px; padding-left: 2px;'
        },
        //in collection item
        hideButton: {
          main: '',
          edit: 'display: none;'
        },
        showHistory:showHistory
      });
    }
  });
});
//diet post route ADD FOOD ITEM
app.post('/diet', function(req,res){
  //submitting data in form to DB
  let food = new Food();
  food.foodName = req.body.foodName;
  food.cal = req.body.cal;
  food.mealType = req.body.mealType;
  //console.log(req.body.foodName);
  food.save(function(err){
    if(err){
      console.log(err);
      return;
    }
    else{
      //redirect user back to diet page
      res.redirect('/diet');
    }
  });
});

//View full history get route
app.get('/diet/diet_history', function(req,res){
  var rand = Math.floor(Math.random() * colorArr.length);
  Food.find({}, function(err, foods){
    foods=foods.reverse();
    if(err){
      console.log(err);
    }
    else{
      //load diet_history.pug, send values
      res.render('diet_history', {
        title: 'History',
        navColor:colorArr[rand],
         foods:foods,
        //css
        hideButton: {
          main: '',
          edit: 'display: none;'
        },
        sideIcon: 'pageview'
      });
    }
  });
});




//accessing single food
app.get('/diet/:id', function(req,res){

  Food.findById(req.params.id, function(err, food){
    //console.log(food.mealType);
    res.render('diet', {
      title: 'Edit Food',
      food: food,
      foods: {
        food
      },
      calCount: calCount,
      calGoal: calGoal,
      //css props
      modalType: {
        //only breakfast icon matters (shortcoming caused by not being able to
      //have )
        breakfast:'dietModalEdit'+food.mealType,
        lunch:'dietModalEditLunch',
        dinner:'dietModalEditDinner'
      },
      //editIcon: '',
      dispbool: {
        breakfast: '',
        lunch: 'display:none;',
        dinner: 'display:none;'
      },
      iconbool: 'edit',
      imgSrc: {
        breakfast: '',
        lunch: '',
        dinner: ''
      },
      sideIcon: 'cancel',
      hideButton: {
        main: 'display: none;',
        edit: 'color: red;'
      }
    });
  });
});

//edit foodItem post route
app.post('/diet/edit/:id', function(req,res){
  //submitting data in form to DB
  let food = {};
  food.foodName = req.body.foodName;
  food.cal = req.body.cal

  let query = {_id:req.params.id}

  Food.update(query, food, function(err){
    if(err){
      console.log(err);
      return;
    }
    else{
      //redirect user back to diet page
      res.redirect('/diet');
    }
  });
});
//edit calGoal post route
app.post('/diet/editCalGoal', function(req,res){
  //update calGoal value (global variable)
  calGoal=req.body.calGoal;
  res.redirect('/diet');
});


//Delete request
app.delete('/diet/:id', function(req, res){
  let query = {_id:req.params.id}
  Food.remove(query, function(err){
    if(err){
      console.log(err);
    }
    //send success message
    res.send('Success');
  });
});

//diet page route (access by adding route /diet at the end of server url)
app.get('/diet/breakfast_add', function(req,res){
  //load diet.pug
  res.render('breakfast_add', {
    title: 'Add Bkfast'
  });
});

//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//start server
app.listen(3000, function(){
  console.log("Server started on port 3000...");
});
