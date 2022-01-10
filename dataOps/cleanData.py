import pymongo
import json
import sys

url = 'mongodb://localhost:27017/'
#url = 'mongodb://localhost:27014/'

dbase = sys.argv[1]
print(dbase)

client = pymongo.MongoClient(url)
db = client[dbase]
usersCol = db['users']
responsesCol = db['responses']

completed_users = []
userRemove = 0
args = len(sys.argv) - 1
spammerCount = 0;
for user in usersCol.find():
    timeCount = 0
    key2pay = user["key2pay"]
    userName = user["user"]
    nCorrect = user["score"]

    responseCount = responsesCol.count_documents({'user' : userName})

    print(userName + ": " + str(responseCount) + "  correct: " + str(nCorrect))

    if(responseCount == 36):
        completed_users.append(userName)
    else:
        userRemove += 1
        print("Should delete:",userName)
        if(args > 1):
            if(sys.argv[2] == "delete"):
                responsesCol.delete_many({'user' : userName})
                usersCol.delete_one({'user' : userName})
                print("Deleting")
    for res in responsesCol.find({'user' : userName}):
        if(res["time"] <= 10):
            timeCount = timeCount+1
    if(timeCount >= 27):
        spammerCount = spammerCount+1
        print("SPAMMER: ",userName)

print("Total Spammers:",spammerCount)

print("Completed Users: " + str(len(completed_users)))
print("Users Removed: " + str(userRemove))

