import pymongo
import json
import time
import datetime
import sys

url = 'mongodb://localhost:27017/'
#url = 'mongodb://localhost:27014/'

dbase = sys.argv[1]
print("database: " + str(dbase))

client = pymongo.MongoClient(url)
db = client[dbase]
usersCol = db['users']
responsesCol = db['responses']

dataArray = []

for user in usersCol.find():

    userResponse = {}

    userName = user['user']
    print(userName)
    demographic = user["surveyResults"]

    userResponse["name"] = userName
    userResponse["demographic"] = demographic

    counter = 0

    type1=[1,2,3,4,5,6,10,11,12,13,14]
    type2=[7,8,9]

    for response in responsesCol.find({"user": userName}):
        if(response["question"] in type1):
            userResponse[counter] = {
            "question": response["question"],
            "time_taken": response["time_taken"],
            "extra_time_taken": response["extra_time_taken"],
            "sequence": response["sequence"]
            }

        else:
            if(response["question"] in type2 and response["question"]==7):
                userResponse[counter] = {
                "question": response["question"],
                "time_taken": response["time_taken"],
                "extra_time_taken": response["extra_time_taken"],
                "%hindu": response["%hindu"],
                "%muslim": response["%muslim"],
                "%christian": response["%christian"],
                "%sikh": response["%sikh"],
                "%buddhist": response["%buddhist"],
                "%jain": response["%jain"],
                "%others": response["%others"],
                "%none": response["%none"]
                }
            elif(response["question"] in type2 and response["question"]==8):
                userResponse[counter] = {
                "question": response["question"],
                "time_taken": response["time_taken"],
                "extra_time_taken": response["extra_time_taken"],
                "35k": response["35k"],
                "30-35k": response["30-35k"],
                "25-30k": response["25-30k"],
                "20-25k": response["20-25k"],
                "15-20k": response["15-20k"],
                "10-15k": response["10-15k"],
                "7_5-10k": response["7_5-10k"],
                "5-7_5k": response["5-7_5k"],
                "3-5k": response["3-5k"],
                "1-3k": response["1-3k"]
                }
            elif(response["question"] in type2 and response["question"]==9):
                userResponse[counter] = {
                "question": response["question"],
                "time_taken": response["time_taken"],
                "extra_time_taken": response["extra_time_taken"],
                "%"+"bisexual": response["%"+"bisexual"],
                "%"+"heterosexual": response["%"+"heterosexual"],
                "%"+"asexual": response["%"+"asexual"],
                "%trans": response["%trans"],
                "%non-binary": response["%non-binary"],
                "%"+"gay": response["%"+"gay"],
                "%"+"lesbian": response["%"+"lesbian"]
                }
        counter += 1

    #for i in range(14):
        #response = responsesCol.find_one({"user": userName, "question": i})
        #userResponse[i] = {
            #"q1": response["q1"],
            #"q2": response["q2"],
            #"q3": response["q3"],
            #"time": response["time"]
        #}

    dataArray.append(userResponse)

rightNow = datetime.datetime.today().strftime('%m-%d-%Y')
file_name = rightNow + dbase + ".json"

with open(str(file_name), 'w+') as outfile:
	json.dump(dataArray, outfile)

