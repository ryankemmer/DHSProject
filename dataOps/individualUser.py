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
groundtruth = [1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0]

for user in usersCol.find():

    userResponse = {}

    userName = user['user']
    print(userName)
    demographic = user["surveyResults"]

    userResponse["name"] = userName
    userResponse["demographic"] = demographic
    score = 0
    percentage = 0
    for i in range(1,25):
        response = responsesCol.find_one({"user": userName, "question": i})
        if(response["q1"] == groundtruth[i-1]):
            score = score+1
    percentage = (score*100)/24

    print("SCORE = ",score)
    print("PERCENTAGE = ",percentage)
    percentArray.append(percentage)

print(percentArray)
