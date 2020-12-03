#
# Aggregation Models Test
#
# Author: Ryan Kemmer


import json

def tieCheck(x):
    if x.count(x[0]) == len(x):
        return True
    else:
        return False

def majorityVote(predictions):

    #specify binary decisions(1 for yes and 0 for no)
    choices = [1,0]
    #list to count majority votes
    choiceCounts = [0] * len(choices)

    #count each vote
    for i in range(len(choices)):
        for p in predictions:
            if p == choices[i]:
                choiceCounts[i] +=1

    print(choiceCounts)

    #check to see if there is a tie
    tie = tieCheck(choiceCounts)
    #return winner (0 for No, 1 for yes, -1 for tie)
    if tie == False:
        ind = choiceCounts.index(max(choiceCounts))
        if ind == 0:
            winner = 1
        elif ind == 1:
            winner = 0
    else:
        winner = -1
    return winner


def confidenceWeightedVote(predictions, confidence):

    #specify binary decisions(1 for yes and 0 for no)
    choices = [1,0]
    #list to count confidence-weighted votes
    choiceCounts = [0] * len(choices)

    #count each vote and multiply confidence weights
    for i in range(len(choices)):
        for p in predictions:
            if p == choices[i]:
                conf = confidence[i]
                value = conf * .01
                choiceCounts[i] += value

    print(choiceCounts)

    #check to see if there is a tie
    tie = tieCheck(choiceCounts)
    #return winner (0 for No, 1 for yes, -1 for tie)
    if tie == False:
        ind = choiceCounts.index(max(choiceCounts))
        if ind == 0:
            winner = 1
        elif ind == 1:
            winner = 0
    else:
        winner = -1
    return winner


def suprisinglyPopularVote(predictions, crowdPredictions):

    #specify binary decisions(1 for yes and 0 for no)
    choices = [1,0]
    #list to count majority votes
    choiceCounts = [0] * len(choices)
    #list to count majority of what people believed the majority to predict
    choiceCountsCrowd = [0] * len(choices)

    #count each vote to q1
    for i in range(len(choices)):
        for p in predictions:
            if p == choices[i]:
                choiceCounts[i] += 1

    #count each vote to q3
    for i in range(len(choices)):
        for p in crowdPredictions:
            if p == choices[i]:
                 choiceCountsCrowd[i] += 1

    print(choiceCountsCrowd)
    #convert to percentages
    choiceCounts = [x/ len(predictions) for x in choiceCounts]
    choiceCountsCrowd = [x/ len(predictions) for x in choiceCountsCrowd]
    #find the percentage difference between the majority votes, 
    #and what the crowd believed the majority woulf predict
    differences = [m - n for m,n in zip(choiceCounts,choiceCountsCrowd)]

    
    print(differences)
    #check to see if there is a tie
    tie = tieCheck(differences)
    #return winner (0 for No, 1 for yes, -1 for tie)
    if tie == False:
        ind = differences.index(max(differences))
        if ind == 0:
            winner = 1
        elif ind == 1:
            winner = 0
    else:
        winner = -1
    return winner



#
#main
# 

#load json file
with open('12-02-2020Test2-1.json') as f:
    data = json.load(f)

#specify ground truth for each question
groundtruth = [-1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0]

#iterate through responses and calculate the results for each question
for i in range(1,25):

    predictions = []
    confidence = []
    crowdPredictions = []   

    for userResponse in data:
        response = userResponse[str(i)]
        predictions.append(response["q1"])
        confidence.append(response["q2"])
        crowdPredictions.append(response["q3"])


    print('Question: ' + str(i))
    print('Majority Winner: ' + str(majorityVote(predictions)))
    print('Confidence-Weighted Winner: ' + str(confidenceWeightedVote(predictions, confidence)))
    print('SP Winner: ' + str(suprisinglyPopularVote(predictions, crowdPredictions)))
    print('Ground truth: ' + str(groundtruth[i]))
    print()