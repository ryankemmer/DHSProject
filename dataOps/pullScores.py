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

dataArray = []

for user in usersCol.find():

    userResponse = {}
    userScore = user["score"]
    userName = user['user']
    print(userName)
    print(userScore)
    demographic = user["surveyResults"]
    dataArray.append(userScore)
print(dataArray)
