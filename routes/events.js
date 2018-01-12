const express = require('express');
const router = express.Router();

//bring in models (give pathname to article.js (MongoDB specified params))
let Article = require('../models/event');

//Add route (GET)
router.get('/add', function(req, res){
  res.render('add_article', {
    title: 'Add Article'
  });
});


//Add Submit POST route
router.post('/add', function(req, res){
  //check for valid inputs/required
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();

  //get errors
  let errors = req.validationErrors();
  if(errors){
    res.render('add_article', {
      //specifies title to PUG file
      title:'Add Article',
      errors:errors
    });
  }
  else{
    //create new article object if inputs are valid
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err) {
      if(err){
        console.log(err);
        return;
      }
      else{
        //show that article was successfully added
        req.flash('success', 'Article Added');
        //redirects user to main page
        res.redirect('/');
      }
    });
    // //only shows on server console (not browser/client)
    // console.log('Submitted');
    // return;
  }
});


  //load edit form route
  router.get('/edit/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
      res.render('edit_article', {
        title: 'Edit Article',
        article:article
      });
    });
  });


  //Update Submit POST route
  router.post('/edit/:id', function(req, res){
    let article = {};
    //load previous article attributes
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id};

    Article.update(query, article, function(err) {
      if(err){
        console.log(err);
        return;
      }
      else{
        //load success prompt alert at top of page
        req.flash('success', 'Article Updated')
        //redirects user to main page
        res.redirect('/');
      }
    });
    // //only shows on server console (not browser/client)
    // console.log('Submitted');
    // return;
  });


  //Delete request
  router.delete('/:id', function(req, res){
    let query = {_id:req.params.id}
    Article.remove(query, function(err){
      if(err){
        console.log(err);
      }
      //send success message
      res.send('Success');
    });
  });

  //get Single Articles
  router.get('/:id', function(req, res){
    Article.findById(req.params.id, function(err, article){
      res.render('article', {
        article: article
      });
    });
  });

//access from outside
module.exports = router;
