var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
const co = require('co');
const User = require('../User');
const { response } = require('express');

// TODO: Remove hardcoded link
// var url = 'mongodb://localhost:27014/';
var url = 'mongodb://localhost:27017/';

var datab = 'Test1'
var userID = null
let users = [];


//get user instance function
let getUserInstance = uid => users.find(user => user.id === uid);

//snooze function 
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));


//
//Get home page
//


router.get('/', function (req, res, next) {
    res.render('index');
});


//
//Create user and load first activity
//


<<<<<<< HEAD
router.post('/activity/', function(req,res,next){
=======
router.post('/activity/', function (req, res, next) {

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
>>>>>>> acc0bd3fba24c1b89eb5f2eb5e9d666f5515aeb6

    questionNum = currentUser.selectQuestion()
    console.log(questionNum)

    //store user in db
    co(function* () {

        let client = yield MongoClient.connect(url);
        const db = client.db(datab)
        let usersCol = db.collection('users')

<<<<<<< HEAD
  //store user in db 
  co(function* () {
=======
        check = yield usersCol.findOne({"user": currentUser.id})
>>>>>>> acc0bd3fba24c1b89eb5f2eb5e9d666f5515aeb6

        //check to see if user exists in database
        if (check === null && currentUser.id != null) {

<<<<<<< HEAD
    check = yield usersCol.findOne({"user" : currentUser.id})
              
    //check to see if user exists in database
    if(check === null && currentUser.id != null){
              
      //insert new user if user does not exist
      var item = { 
        "user": currentUser.id,
        "key2pay": null,
        "surveyResults": null,
        "score": null
      };
                
      yield usersCol.insertOne(item);

      res.render('activity', {time: 60, userID: currentUser.id, question: questionNum, sequence: currentUser.index})
              
    } 
=======
            //insert new user if user does not exist
            var item = {
                "user": currentUser.id,
                "key2pay": null,
                "surveyResults": null,
            };

            yield usersCol.insertOne(item);
>>>>>>> acc0bd3fba24c1b89eb5f2eb5e9d666f5515aeb6

            res.render('activity', {
                time: 60,
                userID: currentUser.id,
                question: questionNum,
                sequence: currentUser.question
            })

        } else {
            res.render('index', {error: "ERROR: Username already exists"})
        }

    });
});


//
//load activity
//


router.post('/activity/:userID/', function (req, res, next) {

    //Fetch current user
    let currentUser = getUserInstance(req.params.userID);
    prevTime = currentUser.getPrevTime()

    //check to ensure previous response was posted
    co(function* () {

        yield snooze(1000)

        let client = yield MongoClient.connect(url);
        const db = client.db(datab)
        let responseCol = db.collection('responses')

<<<<<<< HEAD
    let client = yield MongoClient.connect(url);
    const db = client.db(datab)
    let responseCol = db.collection('responses')
    let usersCol = db.collection('users')
=======
        check = yield responseCol.findOne({"user": currentUser.id, "question": currentUser.currentQ()})
>>>>>>> acc0bd3fba24c1b89eb5f2eb5e9d666f5515aeb6

        if (check == null) {

            res.render('activity', {
                time: prevTime - 1,
                userID: currentUser.id,
                question: currentUser.currentQ(),
                sequence: currentUser.question,
                error: "ERROR: Please answer all questions!"
            })

<<<<<<< HEAD
      res.render('activity', {time: prevTime -1, userID: currentUser.id, question: currentUser.currentQ(), sequence: currentUser.index, error: "ERROR: Please answer all questions!"})
=======
        } else {
>>>>>>> acc0bd3fba24c1b89eb5f2eb5e9d666f5515aeb6

            currentUser.nextquestion()

            questionNum = currentUser.selectQuestion()
            console.log(questionNum)

<<<<<<< HEAD
      if (currentUser.index < 15){
        res.render('activity', {time: 60, userID: currentUser.id, question: questionNum, sequence: currentUser.index})
      }
      else{

        var truth = [0,0,0,0,0,0,0,1,1,1,1,1,1,1]
        var correct = []
        
        //get results
        for(i = 1; i < 15; i++){
          var response = yield responseCol.findOne({"user": currentUser.id, "question" : i})
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
        for(i = 0; i < 14; i++){
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
=======

            if (currentUser.question < 15) {
                res.render('activity', {
                    time: 60,
                    userID: currentUser.id,
                    question: questionNum,
                    sequence: currentUser.question
                })
            } else {
                res.render('survey', {userID: currentUser.id})
            }
>>>>>>> acc0bd3fba24c1b89eb5f2eb5e9d666f5515aeb6

        }
    });

});


//
//Store data
//


router.post('/activity/:userID/data', function (req, res, next) {

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
        const db = client.db(datab)
        let responseCol = db.collection('responses')

        var item = {
            "user": userID,
            "question": question,
            "time": time,
            "q1": group[1],
            "q2": group[2],
            "q3": group[3]
        };

        if (group[1] != -2 && group[3] != -2) {

            yield responseCol.insertOne(item);
            console.log('posted to db!')

        } else {
            console.log("invalid inuput, retry")
        }

    });

});

router.post('/activity/:use/:userID/data', function (req, res, next) {

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
        const db = client.db(datab)
        let responseCol = db.collection('responses')

        var item = {
            "user": userID,
            "question": question,
            "time": time,
            "q1": group[1],
            "q2": group[2],
            "q3": group[3]
        };

        if (group[1] != -2 && group[3] != -2) {

            yield responseCol.insertOne(item);
            console.log('posted to db!')

        } else {
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


<<<<<<< HEAD
router.post('/survey/:user/:userID/sendSurvey', function(req,res,next){
=======
router.post('/activity/:use/:userID/sendSurvey', function (req, res, next) {
>>>>>>> acc0bd3fba24c1b89eb5f2eb5e9d666f5515aeb6

    //collect variables from front end
    userID = req.params.userID;
    key = req.body.key;
    userDemographic = req.body.userDemographic;
    userDemographic = JSON.parse(userDemographic);

    //storesurvey results
    co(function* () {
        let client = yield MongoClient.connect(url);
        const db = client.db(datab)
        let UsersCol = db.collection('users')

        newItem = {
            "surveyResults": userDemographic,
            "key2pay": key
        }

        UsersCol.updateOne({"user": userID}, {$set: newItem});
        console.log('User Completed task')
    })

    //give a response to load next page
    res.send("{}");

})

<<<<<<< HEAD
=======

>>>>>>> acc0bd3fba24c1b89eb5f2eb5e9d666f5515aeb6
module.exports = router;
