var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
const co = require('co');

//var url = 'mongodb://localhost:27017/';
var url = 'mongodb://34.125.41.169:27017/';

var datab = 'test'

var userID = null
const User = require('../User');
let users = [];
let getUserInstance = uid => users.find(user => user.id === uid);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

//demo

//store userID and load first activity
router.post('/activity', function(req,res,next){

  //prompt to enter username if null
  if (!req.body.userID) {
    res.render('index', {error: "ERROR: Please enter a username"});
    return;
  }

  //Fetch current user
  let currentUser = getUserInstance(req.body.userID);
  
  //add new user if not already exists based on id
  if (!currentUser) {
    users.push(new User(req.body.userID));
    currentUser = getUserInstance(req.body.userID);
  }

  //store user in db
  co(function* () {

    let client = yield MongoClient.connect(url);
    const db = client.db(datab)
    let usersCol = db.collection('users')

    check = yield usersCol.findOne({"user" : user.id})
              
    //check to see if user exists in database
    if(check === null && user.id != null){
              
      //insert new user if user does not exist
      var item = { 
        "user": user.id,
        "key2pay": null,
        "surveyResults": null,
      };
                
      yield usersCol.insertOne(item);

      res.render('activity', {user: user.id})
              
    } 

    else{
      res.render('index', {error: "ERROR: Username already exists"})
    }
  });
});

module.exports = router;
