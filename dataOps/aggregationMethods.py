import json

def tieCheck(x):
    if x.count(x[0]) == len(x):
        return True
    else:
        return False

def majorityVote(predictions):

    choices = [0,1]
    choiceCounts = [0] * len(choices)

    for i in range(len(choices)):
        for p in predictions:
            if p == choices[i]:
                choiceCounts[i] +=1

    print(choiceCounts)
    tie = tieCheck(choiceCounts)
    if tie == False:
        winner = choiceCounts.index(max(choiceCounts))
    else:
        winner = -1
    return winner


def confidenceWeightedVote(predictions, confidence):

    choices = [0,1]
    choiceCounts = [0] * len(choices)

    for i in range(len(choices)):
        for p in predictions:
            if p == choices[i]:
                conf = confidence[i]
                value = conf * .01
                choiceCounts[i] += value

    print(choiceCounts)
    tie = tieCheck(choiceCounts)
    if tie == False:
        winner = choiceCounts.index(max(choiceCounts))
    else:
        winner = -1
    return winner


def suprisinglyPopularVote(predictions, crowdPredictions):

    choices = [0,1]
    choiceCounts = [0] * len(choices)
    choiceCountsCrowd = [0] * len(choices)

    for i in range(len(choices)):
        for p in predictions:
            if p == choices[i]:
                choiceCounts[i] += 1

    for i in range(len(choices)):
        for p in crowdPredictions:
            if p == choices[i]:
                 choiceCountsCrowd[i] += 1


    #convert to percentages
    choiceCounts = [x/ len(predictions) for x in choiceCounts]
    choiceCountsCrowd = [x/ len(predictions) for x in choiceCountsCrowd]
    differences = [m - n for m,n in zip(choiceCounts,choiceCountsCrowd)]


    print(differences)
    tie = tieCheck(differences)
    if tie == False:
        winner = differences.index(max(differences))
    else:
        winner = -1
    return winner


#
#main
# 



with open('11-06-2020Test1.json') as f:
    data = json.load(f)

groundtruth = [0,0,0,0,0,0,0,1,1,1,1,1,1,1]

for i in range(14):

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
