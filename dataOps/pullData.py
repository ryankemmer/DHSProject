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
    yesCount = 0
    noCount = 0
    userName = user['user']
    print(userName)
    demographic = user["surveyResults"]

    userResponse["name"] = userName
    userResponse["demographic"] = demographic

    for i in range(1,25):
        print(i," = LOOP ENTERED")
        response = responsesCol.find_one({"user": userName, "question": i})

        if(response == None):
            continue
        if(response["q1"] == 0):
            noCount = noCount + 1
        else:
            yesCount = yesCount + 1
        userResponse[i] = {
            "q1": response["q1"],
            "q2": response["q2"],
            "q3": response["q3"],
            "bb": response["bb"],
            "time": response["time"]
        }
        print(userResponse)
    print("Yes Count = "+str(yesCount))
    print("No Count = "+str(noCount))
    dataArray.append(userResponse)

rightNow = datetime.datetime.today().strftime('%m-%d-%Y')
file_name = rightNow + dbase + ".json"

with open(str(file_name), 'w+') as outfile:
	json.dump(dataArray, outfile)
