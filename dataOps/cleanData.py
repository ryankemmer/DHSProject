
import pymongo
import json
import sys
import math
#url = 'mongodb://localhost:27017/'
url = 'mongodb://localhost:27014/'

dbase = sys.argv[1]
print(dbase)

client = pymongo.MongoClient(url)
db = client[dbase]
usersCol = db['users']
responsesCol = db['responses']

completed_users = []
spammers = []

userRemove = 0
args = len(sys.argv) - 1

with open('08-05-2021Test4_3_1.json') as f:
    data = json.load(f)

#specify ground truth for each question
groundtruth = [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1]


for user in usersCol.find():

    responses = [] #for all qs
    answers_q1 = [] #for q1
    answers_q2 = [] #for q2
    answers_q3 = [] #for q3
    answers_q4 = [] #for q4
    time = []

    key2pay = user["key2pay"] #surveyCode
    userName = user["user"]
    nCorrect = user["score"] #total correct

    responseCount = responsesCol.count_documents({'user' : userName})


    print(userName + ": " + str(responseCount) + "  correct: " + str(nCorrect))

    if(responseCount == 24):
        completed_users.append(userName)
    else:
        userRemove += 1
        if(args > 1):
            if(sys.argv[2] == "delete"):
                print(userName)
                print("ACtually reponses are")
                print(responseCount)
                responsesCol.delete_many({'user' : userName})
                #usersCol.delete_one({'user' : userName})
            if(sys.argv[2] == "spam-delete"): #spam check
                for i in responseCount: #for each question
                    for userResponse in data:
                        response = userResponse[str(i + 1)]
                        answers_q1.append(response["q1"])
                        answers_q2.append(response["q2"])
                        answers_q3.append(response["q3"])
                        answers_q4.append(response["q4"])
                        time.append(response["time"])

                flag = False;
                #honeypot wrong
                #honeypotWrongCount = 0;

                #for i in honeypots: #checks all honeypot qs
                    #if(answers_q1[honeypots[i]] != groundtruth[honeypots[i]]):
                        #honeypotWrongCount = honeypotWrongCount+1;

                #if(honeypotWrongCount == len(honeypots)): #all honeypots are wrong
                    #flag = True;

                #time taken less than 5 seconds
                lessTime = 0;
                numOfQs = int (0.75*responseCount)

                for i in numOfQs:
                    if(time[i] <= 5):
                        lessTime = lessTime + 1

                if(lessTime == numOfQs):
                    flag = True

                #Y or N for all
                yesCount = 0
                noCount = 0

                for i in responseCount:
                    if(answers_q1[i] == 1):
                        yesCount = yesCount + 1
                    else:
                        noCount = noCount + 1

                if(yesCount == responseCount or noCount == responseCount):
                    flag = True

                #if flag is true then user is a spammer so delete from db
                if(flag):
                    spammers.append(user)
print(spammers)

print("Completed Users: " + str(len(completed_users)))
print("Users Removed: " + str(userRemove))
