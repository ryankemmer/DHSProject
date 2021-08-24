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
usersBB = []
client = pymongo.MongoClient(url)
db = client[dbase]
usersCol = db['users']
responsesCol = db['responses']
percentArray = []
dataArray = []

bbStartX = [200,150,75,200,175,0,50,75,25,0,350,0,0]
bbStartY = [20,350,350,225,250,275,350,170,25,350,200,170,95]
bbEndX = [358,404,204,454,304,129,304,465,233,154,254,479,158,158]
bbEndY = [150,500,425,375,325,350,500,300,100,500,275,300,225]

#specify ground truth for each question
groundtruth = [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1]

for user in usersCol.find():

    userName = user['user']
    userResponse = responsesCol.find({"user":userName})
    userBBCount = 0
    totalBBCount = 0

    #print(userResponse["q1"])
    print(userName)
    demographic = user["surveyResults"]
    #fnr = 0
    score = user['score']
    #if(score != "None"):
        #print(score)
        #percentArray.append(score*100/24)

    for i in range(1,25):
        #print(i," = LOOP ENTERED")

        response = responsesCol.find_one({"user": userName, "question": i})
        print(response["boundingBox"])

        if(i > 11):

            if(response["boundingBox"]["startX"] != None and response["boundingBox"]["startY"] != None and response["boundingBox"]["w"] != None):
                totalBBCount = totalBBCount + 1
                if(response["boundingBox"]["w"] < 0 or  response["boundingBox"]["h"] < 0):
                    userStartX = response["boundingBox"]["startX"] + response["boundingBox"]["w"]
                    userStartY = response["boundingBox"]["startY"] + response["boundingBox"]["h"]
                    userEndX = response["boundingBox"]["startX"]
                    userEndY = response["boundingBox"]["startY"]

                    if(userStartX <= bbStartX[i-12]+10 and userStartX >= bbStartX[i-12]-10):
                        if(userEndX <= bbEndX[i-12]+10 and userEndX >= bbEndX[i-12]-10):
                            if(userStartY <= bbStartY[i-12]+10 and userStartY >= bbStartY[i-12]-10):
                                if(userEndY <= bbEndY[i-12]+10 and userEndY >= bbEndY[i-12]-10):
                                    print("BB X start Coordinate : " + str(bbStartX[i-12]))
                                    print("BB Y start Coordinate : " + str(bbStartY[i-12]))
                                    print("BB X end Coordinate : " + str(bbEndX[i-12]))
                                    print("BB Y end Coordinate : " + str(bbEndY[i-12]))
                                    userBBCount = userBBCount + 1
                else:
                    userStartX = response["boundingBox"]["startX"]
                    userStartY = response["boundingBox"]["startY"]
                    userEndX = response["boundingBox"]["startX"] + response["boundingBox"]["w"]
                    userEndY = response["boundingBox"]["startY"] + response["boundingBox"]["h"]

                    if(userStartX <= bbStartX[i-12]+10 and userStartX >= bbStartX[i-12]-10):
                            print()
                        if(userEndX <= bbEndX[i-12]+10 and userEndX >= bbEndX[i-12]-10):
                            if(userStartY <= bbStartY[i-12]+10 and userStartY >= bbStartY[i-12]-10):
                                if(userEndY <= bbEndY[i-12]+10 and userEndY >= bbEndY[i-12]-10):
                                    print("BB X start Coordinate : " + str(bbStartX[i-12]))
                                    print("BB Y start Coordinate : " + str(bbStartY[i-12]))
                                    print("BB X end Coordinate : " + str(bbEndX[i-12]))
                                    print("BB Y end Coordinate : " + str(bbEndY[i-12]))
                                    userBBCount = userBBCount + 1

    print("Total BB = "+str(totalBBCount))
    print("User correct BB = "+str(userBBCount))
    usersBB.append(userBBCount)
