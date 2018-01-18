const express = require('express');
const router = express.Router();
const moment = require('moment');
app.locals.moment=require('moment');
//bring in food model
let Food = require('../models/foodItem');
//initiate global variables
var calCount=0;
var calGoal=2000;
var colorArr = [
  'red darken-1',
  'red darken-2',
  'pink darken-1',
  'pink darken-2',
  'purple darken-1',
  'purple darken-2',
  'blue darken-1'
];
var foodMasterArr ={

};
//diet page route (access by adding route /diet at the end of server url)
router.get('', function(req,res){
  var rand = Math.floor(Math.random() * colorArr.length);
  Food.find({}, function(err, foods){
    //reverse array to get most recent foods at beginning of array
    foods = foods.reverse();
    //console.log(foods);

    //get current date
    var today = new Date();
    var currentDay = today.getDate();
    var currentMon = today.getMonth()+1; //January is 0!
    var currentYr = today.getFullYear();

    if(currentDay<10) {
        currentDay = '0'+currentDay;
    }
    if(currentMon<10) {
        currentMon = '0'+currentMon;
    }
    today = currentMon + '/' + currentDay + '/' + currentYr;

    var currFoods = [];
    //compute unique array of logdates for the collection headers

    var temp = moment(foods[0].logDate).format("DD");
    var logDateHeaders = [temp];
    //compute total calorie calCount
    //reset calCount everytime computation is made
    calCount=0;
    for(var i=0;i<foods.length;i++){
      //console.log("the current day is: "+currentDay+" and the most recent entry is: "+day);
      var day = moment(foods[i].logDate).format("DD");
      //check if user added date is current date
      if(day ==currentDay){
        calCount+=foods[i].cal;
        currFoods.push(foods[i]);
      }
      if(day != temp){
        temp = day;
        logDateHeaders.push(day);
      }
      //console.log('food '+i+ ' on day: '+moment(foods[i].logDate).format("DD"));
    }
    //console.log(logDateHeaders);
    //toggle view history button (if food array has more than 2 food items), true = show, false=hide
    var toggleHistory = false;
    var showHistory ='';
    if(currFoods.length>2){
      toggleHistory=true;
      showHistory ='';
      currFoods=[currFoods[0], currFoods[1]];
    }
    else if (currFoods.length==0){
      //currFoods=placeholderFood;
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
        foods: currFoods,
        food:{},
        moment: moment,
        //logDateHeaders: logDateHeaders,
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
        iconbool: {
          breakfast: '',
          lunch: ''
        },
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
router.post('', function(req,res){
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
router.get('/diet_history', function(req,res){
  var rand = Math.floor(Math.random() * colorArr.length);
  Food.find({}, function(err, foods){
    foods=foods.reverse();

    //initialize temporary comparator
    var temp = moment(foods[0].logDate).format("MM-DD-YYYY dddd");
    //initialize foodSorted array
    var foodSorted={
      [temp]: []
    };

    for(var i=0;i<foods.length;i++){
      //get date of current element
      var date = moment(foods[i].logDate).format("MM-DD-YYYY dddd");
      if(date==temp){
        foodSorted[temp].push(foods[i]);
      }
      if(date != temp){
        temp = date;
        foodSorted[temp]=[foods[i]];
        //logDateHeaders.push(date);
      }
    }




    if(err){
      console.log(err);
    }
    else{
      //load diet_history.pug, send values
      res.render('diet_history', {
        title: 'History',
        navColor:colorArr[rand],
        foods:foodSorted,
        moment:moment,
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
router.get('/:id', function(req,res){

  Food.findById(req.params.id, function(err, food){
    //console.log(food.mealType);
    foods=[food];
    res.render('diet', {
      title: 'Edit Food',
      food: food,
      foods:foods,
      calCount: calCount,
      calGoal: calGoal,
      moment: moment,
      //css props
      modalType: {
        //only breakfast icon matters (shortcoming caused by not being able to
      //have )
        breakfast:'dietModalEdit'+food.mealType,
        lunch:'dietModalAdd'+food.mealType,
        dinner:'dietModalEditDinner'
      },
      //editIcon: '',
      dispbool: {
        breakfast: '',
        lunch: '',
        dinner: 'display:none;'
      },
      iconbool: {
        breakfast:'edit',
        lunch: 'add'
      },
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
router.post('/edit/:id', function(req,res){
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
router.post('/editCalGoal', function(req,res){
  //update calGoal value (global variable)
  calGoal=req.body.calGoal;
  res.redirect('/diet');
});


//Delete request
router.delete('/:id', function(req, res){
  let query = {_id:req.params.id}
  Food.remove(query, function(err){
    if(err){
      console.log(err);
    }
    //send success message
    res.send('Success');
  });
});

// //diet page route (access by adding route /diet at the end of server url)
// router.get('/diet/breakfast_add', function(req,res){
//   //load diet.pug
//   res.render('breakfast_add', {
//     title: 'Add Bkfast'
//   });
// });
module.exports = router;
