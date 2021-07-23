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
array = [16, 13, 20, 15, 21, 20, 17, 24, 14, 22, 9, 21, 20, 14, 22, 23, 20, 24]
for user in usersCol.find():

    userResponse = {}
    userScore = user["score"]
    userName = user['user']
    print(userName)
    print(userScore)
    demographic = user["surveyResults"]
    dataArray.append(userScore)
print(dataArray)

count4 = 0
count8 = 0
count12 = 0
count16 = 0
count20 = 0
count24 = 0

for z in dataArray:
    if(z > 0 and z <=4):
        count4 = count4+1
    elif(z > 4 and z <=8):
        count8 = count8+1
    elif(z > 8 and z <=12):
        count12 = count12+1
    elif(z > 12 and z <=16):
        count16 = count16+1
    elif(z > 16 and z <=20):
        count20 = count20+1
    else:
        count24 = count24+1
print(count4)
print(count8)
print(count12)
print(count16)
print(count20)
print(count24)
