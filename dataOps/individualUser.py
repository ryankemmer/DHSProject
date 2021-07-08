import pymongo
import json
import time
import datetime
import sys

#url = 'mongodb://localhost:27017/'
url = 'mongodb://localhost:27014/'

dbase = sys.argv[1]
print("database: " + str(dbase))

client = pymongo.MongoClient(url)
db = client[dbase]
usersCol = db['users']
responsesCol = db['responses']
percentArray = []
dataArray = []
#specify ground truth for each question
groundtruth = [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1]

for user in usersCol.find():

    userName = user['user']
    userResponse = responsesCol.find({"user":userName})
    #print(userResponse["q1"])
    print(userName)
    demographic = user["surveyResults"]
    fnr = 0
    score = user['score']
    if(score != "None"):
        print(score)
        percentArray.append(score*100/24)

    for x in userResponse:

        if(x["question"] > 8 and x["q1"] != 1):
            fnr = fnr+1
    print("FNR = ",(fnr*100/8))
print(percentArray)
