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

    //store user in db
    co(function* () {

        let client = yield MongoClient.connect(url);
        const db = client.db(datab)
        let usersCol = db.collection('users')

        check = yield usersCol.findOne({"user": currentUser.id})

        //check to see if user exists in database
        if (check === null && currentUser.id != null) {

            //insert new user if user does not exist
            var item = {
                "user": currentUser.id,
                "key2pay": null,
                "surveyResults": null,
            };

            yield usersCol.insertOne(item);

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

        check = yield responseCol.findOne({"user": currentUser.id, "question": currentUser.currentQ()})

        if (check == null) {

            res.render('activity', {
                time: prevTime - 1,
                userID: currentUser.id,
                question: currentUser.currentQ(),
                sequence: currentUser.question,
                error: "ERROR: Please answer all questions!"
            })

        } else {

            currentUser.nextquestion()

            questionNum = currentUser.selectQuestion()
            console.log(questionNum)


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
            "q3": group[3],
            "x": group[4],
            "y": group[5]
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
            "q3": group[3],
            "x": group[4],
            "y": group[5]
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


router.post('/activity/:use/:userID/sendSurvey', function (req, res, next) {

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

module.exports = router;
