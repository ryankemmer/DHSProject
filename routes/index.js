var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
const co = require('co');
const User = require('../User');
const { response } = require('express');
<<<<<<< HEAD

var url = 'mongodb://localhost:27014/'; //for server
//var url = 'mongodb://localhost:27017/'; //for localhost
totalQs = 16;
//var url = 'mongodb://localhost:27014/'; //for server
//var url = 'mongodb://localhost:27017/'; //for localhost


//first acitivity to
var datab1 = 'Test4_1_3'
var datab2 = 'Test4_2_1'
var userID = null
let users = [];


var yesCount1 = [4,8,2,4,4,3,5,2,6,8,6,6,7,7,3,3]; //db1
var noCount1 = [15,11,17,15,15,16,14,17,13,11,13,13,12,12,16,16]; //db1
var yesConf1 = [77,63,60,67,80,63,76,55,78,68,88,60,85,64,83,80]; //db1
var noConf1 = [58,64,66,62,58,60,57,62,52,62,70,66,62,66,65,66]; //db1

var yesCount2 = [3,6,2,1,3,4,2,5,12,12,10,6,7,11,13,11]; //db2
var noCount2 = [15,12,16,17,15,14,16,13,6,6,8,12,11,7,5,7]; //db2
var yesConf2 = [70,66,80,80,76,65,45,80,97,91,89,46,94,88,90,89]; //db2
var noConf2 = [74,63,71,61,70,73,66,61,66,61,73,71,71,71,62,71]; //db2

var yesCount3 = [5,4,1,6,4,5,4,3,11,11,11,5,7,2,9,9]; //db3
var noCount3 = [16,17,20,15,17,16,17,18,10,10,10,16,14,19,12,12]; //db3
var yesConf3 = [82,57,80,85,67,70,65,50,85,89,81,78,82,80,82,84]; //db3
var noConf3 = [71,69,58,60,71,65,65,66,63,65,68,66,67,64,69,62]; //db3

var yesCount4 = [5,3,4,6,6,5,5,2,10,11,14,8,10,8,13,8]; //db4
var noCount4 = [14,16,15,13,13,14,14,17,9,8,5,11,9,11,6,11]; //db4
var yesConf4 = [86,70,75,70,81,68,70,65,88,83,90,82,90,68,82,91]; //db4
var noConf4 = [60,58,70,70,57,65,62,59,84,68,68,63,60,64,83,70]; //db4


//get user instance function
let getUserInstance = uid => users.find(user => user.id === uid);

//snooze function
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));



//
//Get home page
//


router.get('/', function(req, res, next) {
  res.render('index');
  console.log("Index loaded");
});




//
//Create user and load first activity
//


router.post('/activity/', function(req,res,next){

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

  questionNum = currentUser.selectQuestion()
  console.log(questionNum)

//checks if entry is in first part activity
  co(function* () {

    let client = yield MongoClient.connect(url);
    var db = client.db(datab1) //first part db
    let usersCol = db.collection('users')

    check = yield usersCol.findOne({"user" : currentUser.id})
    console.log("USER: "+check);

    //check to see if user exists in database
    if(check != null && currentUser.id != null){
      console.log("Present in datab1");

      db = client.db(datab2) //second part db
      let usersCol = db.collection('users')
      check = yield usersCol.findOne({"user" : currentUser.id})
      console.log("D2 User: "+check);

      if(check === null){
        console.log("Add to second db");
        //insert new user if user does not exist
        var item = {
          "user": currentUser.id,
          "key2pay": null,
          "surveyResults": null,
          "score": null
        };

        yield usersCol.insertOne(item);

        //contiunes to second part
        res.render('activity', {time: 60, userID: currentUser.id, question: questionNum, sequence: currentUser.index, yes: yesCount1[questionNum-1], no: noCount1[questionNum-1], yesC: yesConf1[questionNum-1], noC: noConf1[questionNum-1]})
      }
      else{
        res.render('index', {error: "ERROR: Cannot repeat activity"})
      }
    }
    else{
      res.render('index', {error: "ERROR: Cannot continue without finishing part 1"})
    }

  });

});



//
//load activity
//


router.post('/activity/:userID/', function(req,res,next){

  //Fetch current user
  let currentUser = getUserInstance(req.params.userID);
  prevTime = currentUser.getPrevTime()

  //check to ensure previous response was posted
  co(function* () {

    yield snooze(1000)

    let client = yield MongoClient.connect(url);
    const db = client.db(datab2)
    let responseCol = db.collection('responses')
    let usersCol = db.collection('users')

    check = yield responseCol.findOne({"user" : currentUser.id, "question" : currentUser.currentQ()})

    if (check == null){

      res.render('activity', {time: prevTime -1, userID: currentUser.id, question: currentUser.currentQ(), sequence: currentUser.index,  yes: yesCount1[questionNum-1], no: noCount1[questionNum-1], yesC: yesConf1[questionNum-1], noC: noConf1[questionNum-1], error: "ERROR: Please answer all questions!"})

    }else{

      currentUser.nextquestion()

      questionNum = currentUser.selectQuestion()

      if (currentUser.index <= totalQs){
        console.log("Q no: " + currentUser.index);
        res.render('activity', {time: 60, userID: currentUser.id, question: questionNum, sequence: currentUser.index,  yes: yesCount1[questionNum-1], no: noCount1[questionNum-1], yesC: yesConf1[questionNum-1], noC: noConf1[questionNum-1]})
      }
      else{
        //change Ground Truth Array
        var truth = [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1] //16 in length
        var correct = []

        //get results
        for(i = 0; i < totalQs; i++){

          var response = yield responseCol.findOne({"user": currentUser.id, "question" : i+1})
          console.log(response)
          if (response == null){
            console.log('null response')
          }
          else if (response["q1"] == truth[i]){
            correct.push(1)
          } else{
            correct.push(0)
          }
        }

        var sum = 0

        //save score of user
        for(i = 0; i < totalQs; i++){
          sum = sum + correct[i]
        }

        newItem = {"score" : sum}

        usersCol.updateOne({"user": currentUser.id}, { $set: newItem });

        //get leaderboard
        leaders = usersCol.find().sort({score: -1}).toArray(function(err, leaderboard) {
          if (err) throw err;
          leaderboard = leaderboard.slice(0,5)
          res.render('leaderboard', {userID: currentUser.id, total: sum, leaderboard})
        });
      }

    }
  });

});



//
//Store data
//



router.post('/activity/:userID/data', function(req,res,next){

  userID = req.params.userID;

  let currentUser = getUserInstance(userID);

  question = currentUser.currentQ()

  let group = Object.keys(req.body)
  group = JSON.parse(group)

  group[2] = group[2].substring(0, group[2].length - 1);
  group[2] = parseInt(group[2])
  console.log(group)

  TimeLeft = group[0]
  currentUser.setPrevTime(TimeLeft)
  time = 60 - TimeLeft

  console.log('timeLeft  ', TimeLeft)
  console.log('time spent  ', time)

  //store response in db
  co(function* () {

    let client = yield MongoClient.connect(url);
    const db = client.db(datab2)
    let responseCol = db.collection('responses')

    var item = {
            "user": userID,
            "question": question,
            "time": time,
            "q1": group[1],
            "q2": group[2],
            "q3": group[3],
            "x": group[4],
            "y": group[5]
        };


    if (group[1] != -2 && group[3] != -2){

      yield responseCol.insertOne(item);
      console.log('posted to db!')

    }else{
      console.log("invalid inuput, retry")
    }

  });

});

router.post('/activity/:use/:userID/data', function(req,res,next){

  userID = req.params.userID;

  let currentUser = getUserInstance(userID);

  question = currentUser.currentQ()

  let group = Object.keys(req.body)
  group = JSON.parse(group)

  group[2] = group[2].substring(0, group[2].length - 1);
  group[2] = parseInt(group[2])
  console.log(group)

  TimeLeft = group[0]
  currentUser.setPrevTime(TimeLeft)
  time = 60 - TimeLeft

  console.log('timeLeft  ', TimeLeft)
  console.log('time spent  ', time)

  //store response in db
  co(function* () {

    let client = yield MongoClient.connect(url);
    const db = client.db(datab2)
    let responseCol = db.collection('responses')

    var item = {
            "user": userID,
            "question": question,
            "time": time,
            "q1": group[1],
            "q2": group[2],
            "q3": group[3],
            "x": group[4],
            "y": group[5]
        };


    if (group[1] != -2 && group[3] != -2){

      yield responseCol.insertOne(item);
      console.log('posted to db!')

    }else{
      console.log("invalid inuput, retry")
    }

  });

});


//
//Load survey page
//


router.post('/survey/:userID', function(req,res,next){

  //Fetch current user
  let currentUser = getUserInstance(req.params.userID);
  res.render('survey', {userID: currentUser.id})

});






//
//Store survery response
//


router.post('/survey/:user/:userID/sendSurvey', function(req,res,next){

  //collect variables from front end
  userID = req.params.userID;
  key = req.body.key;
  userDemographic = req.body.userDemographic;
  userDemographic = JSON.parse(userDemographic);

  //storesurvey results
  co(function* () {
    let client = yield MongoClient.connect(url);
    const db = client.db(datab2)
    let UsersCol = db.collection('users')

    newItem = {
        "surveyResults": userDemographic,
        "key2pay": key
    }

    UsersCol.updateOne({"user": userID}, { $set: newItem });
    console.log('User Completed task')
})

  //give a response to load next page
  res.send("{}");

})

module.exports = router;
