import pymongo
import json
import time
import datetime
import sys
import numpy

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

bbStartX = [400,300,150,400,350,0,100,150,50,0,700,0,0]
bbStartY = [39,699,700,449,500,550,699,339,50,699,400,339,189]
bbEndX = [715,807,408,907,608,258,607,465,308,507,958,315,315]
bbEndY = [300,1000,850,750,650,700,1000,600,200,1000,550,600,450]

#specify ground truth for each question
groundtruth = [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1]

for user in usersCol.find():

    userName = user['user']
    userResponse = responsesCol.find({"user":userName})
    userBBCount = 0
    j = -1
    #print(userResponse["q1"])
    print(userName)
    demographic = user["surveyResults"]
    fnr = 0
    score = user['score']
    if(score != "None"):
        print(score)
        percentArray.append(score*100/24)

    for i in range(1,25):
        print(i," = LOOP ENTERED")

        response = responsesCol.find_one({"user": userName, "question": i})
        print(response["boundingBox"])

        if(i > 11):
            if(response["boundingBox"]["startX"] != None and response["boundingBox"]["startY"] != None and response["boundingBox"]["w"] != None):

                if(response["boundingBox"]["w"] < 0 or  response["boundingBox"]["h"] < 0):
                    userStartX = response["boundingBox"]["startX"] + response["boundingBox"]["w"]
                    userStartY = response["boundingBox"]["startY"] + response["boundingBox"]["h"]
                    userEndX = response["boundingBox"]["startX"]
                    userEndY = response["boundingBox"]["startY"]

                    if(userStartX <= bbStartX[j-11]+10 or userStartX >= bbStartX[j-11]-10 and userEndX <= bbEndX[j-11]+10 or userEndX >= bbEndX[j-11]-10 and userStartY <= bbStartY[j-11]+10 or userStartY >= bbStartY[j-11]-10 and userEndY <= bbEndY[j-11]+10 or userEndY >= bbEndY[j-11]-10):
                        userBBCount = userBBCount + 1
                else:
                    userStartX = response["boundingBox"]["startX"]
                    userStartY = response["boundingBox"]["startY"]
                    userEndX = response["boundingBox"]["startX"] + response["boundingBox"]["w"]
                    userEndY = response["boundingBox"]["startY"] + response["boundingBox"]["h"]

                    if((userStartX <= bbStartX[j-11]+10 or userStartX >= bbStartX[j-11]-10) and (userEndX <= bbEndX[j-11]+10 or userEndX >= bbEndX[j-11]-10) and (userStartY <= bbStartY[j-11]+10 or userStartY >= bbStartY[j-11]-10) and (userEndY <= bbEndY[j-11]+10 or userEndY >= bbEndY[j-11]-10)):
                        userBBCount = userBBCount + 1

    print(bbCount)
    usersBB.append(bbCount)
