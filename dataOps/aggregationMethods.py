#
# Aggregation Models Test
#
# Author: Ryan Kemmer, Yeawon Yoo
#
# v3__ updated on Dec 7 09:04


import json
import math

def tieCheck(x):
    if x.count(x[0]) == len(x):
        return True
    else:
        return False

def checkAnswer(x,gtruth):

    #if x is a tie, change the value to be incorrect
    if x == -1:
        if gtruth == 0:
            x = 1
        else:
            x = 0

    if x == 1 and gtruth == 0:
        return 'FP'
    if x == 0 and gtruth == 0:
        return 'TN'
    if x == 1 and gtruth == 1:
        return 'TP'
    if x == 0 and gtruth == 1:
        return 'FN'

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

    print("vote outcome:", choiceCounts)

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
        for j in range(len(predictions)):
            if predictions[j] == choices[i]:
                conf = confidence[j]
                value = conf * .01
                choiceCounts[i] += value

    #print("vote outcome:", choiceCounts)

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

def highConfidenceWeightedVote(predictions, confidence):

    #specify binary decisions(1 for yes and 0 for no)
    choices = [1,0]
    #list to count confidence-weighted votes
    choiceCounts = [0] * len(choices)

    #count each vote and multiply confidence weights
    for i in range(len(choices)):
        for j in range(len(predictions)):
            if predictions[j] == choices[i]:
                conf = confidence[j]
                if conf > 80:
                    value = conf * .01
                    choiceCounts[i] += value

    print("vote outcome:", choiceCounts)

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


def surprisinglyPopularVote(predictions, crowdPredictions):
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
                
    #print(choiceCounts)
    #count each vote to q3
    for i in range(len(choices)):
        for p in crowdPredictions:
            if p == choices[i]:
                 choiceCountsCrowd[i] += 1

    #print(choiceCountsCrowd)
    
    #differences = [m - n for m,n in zip(choiceCounts,choiceCountsCrowd)]
    
    #convert to percentages
    #choiceCounts = [x/ len(predictions) for x in choiceCounts]
    #choiceCountsCrowd = [x/ len(predictions) for x in choiceCountsCrowd]
    #find the percentage difference between the majority votes, 
    #and what the crowd believed the majority woulf predict

    differences = [m - n for m,n in zip(choiceCounts,choiceCountsCrowd)]

    #print(differences)
    
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

def honeypot(predictions, trap):

    #specify binary decisions(1 for yes and 0 for no)
    choices = [1,0]
    
    #list to count majority votes
    choiceCounts = [0] * len(choices)
    
    #count each vote to q1 
    for i in range(len(choices)):
        for j in range(len(predictions)):
            # if judge j returns correct answers to all the trapping questions
            if (predictions[j] == choices[i]) and (trap[j] == max(trap)):
                choiceCounts[i] += 1
                
    #print(choiceCounts)

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

def weighted_honeypot(predictions, trap):

    #specify binary decisions(1 for yes and 0 for no)
    choices = [1,0]
    
    #list to count majority votes
    choiceCounts = [0] * len(choices)
    #count each vote to q1 
    for i in range(len(choices)):
        for j in range(len(predictions)):
            # if judge j returns correct answers to all the trapping questions
            if predictions[j] == choices[i]:
                choiceCounts[i] += 1*trap[j]/(max(trap)*1.0)
                
    #print(choiceCounts)
    
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



def ELICE(predictions, groundtruth, trap_true, trap_false):

    #alpha = expertise level --> reliability of judge
    alpha = [0] * len(predictions)
    #beta = difficulty of questions
    beta = 0
    P = 0
    
    
    for i in range(len(predictions)):
        alpha[i] += (trap_true[i] - trap_false[i])*1/3.0     
        if predictions[j] == groundtruth:
            beta += 1/(len(predictions)*1.0)   
                
    #score --- inferred labels
    for i in range(len(predictions)):
        if predictions[i] == 1:
            P += (1/(len(predictions)*1.0))*(1/(1+math.exp(-alpha[i]*beta)))*predictions[i]
        else:
            P += (1/(len(predictions)*1.0))*(1/(1+math.exp(-alpha[i]*beta)))*(-1)            

    #return winner (negative for No, positive for yes,)
    if P >= 0:
        winner = 1
    else:
        winner = 0
    return winner

#main
# 

#load json file
with open('12-02-2020Test2-1.json') as f:
    data = json.load(f)

#specify ground truth for each question
groundtruth = [1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0]

#honeypots (indexed starting at 0)
honeypots = [2,3,14,15]

trap_true = [0]*48
trap_false = [0]*48

#fill values in trap_true and trap_false arrays
for i in range(24):

    predictions = []

    for userResponse in data:
        response = userResponse[str(i + 1)]
        predictions.append(response["q1"])

    if i in honeypots:
        for j in range(len(predictions)):
            if predictions[j] == groundtruth[i]:
                trap_true[j] +=1
            else:
                trap_false[j] +=1


#aggregation method totals 
majTotals = []
confTotals = []
hconfTotals = []
spTotals = []
hpTotals = []
whTotals = []
eTotals = []

#calculate results
for i in range(24):

    predictions = []
    confidence = []
    crowdPredictions = []   

    for userResponse in data:
        response = userResponse[str(i + 1)]
        predictions.append(response["q1"])
        confidence.append(response["q2"])
        crowdPredictions.append(response["q3"])

    print('************ Question: ' + str(i+1) + ' ===> Ground Truth: ' + str(groundtruth[i]) + '**************')
#    print('==================================')
    print('Majority Winner: ' + str(majorityVote(predictions)))
#    print('==================================')
    print('Confidence-Weighted Winner: ' + str(confidenceWeightedVote(predictions, confidence)))
#    print('==================================')
    print('High Confidence Winner: ' + str(highConfidenceWeightedVote(predictions, confidence)))
#    print('==================================')
    print('SP Winner: ' + str(surprisinglyPopularVote(predictions, crowdPredictions)))
#    print('==================================')
    
    if i not in honeypots:

        print('Honeypot Winner: ' + str(honeypot(predictions, trap_true)))
        print('Weighted Honeypot Winner: ' + str(weighted_honeypot(predictions, trap_true)))
        print('ELICE: ' + str(ELICE(predictions, groundtruth[i], trap_true, trap_false)))
        
        #add to array of predictions
        majTotals.append(checkAnswer(majorityVote(predictions),groundtruth[i]))
        confTotals.append(checkAnswer(confidenceWeightedVote(predictions, confidence),groundtruth[i]))
        hconfTotals.append(checkAnswer(highConfidenceWeightedVote(predictions, confidence),groundtruth[i]))
        spTotals.append(checkAnswer(surprisinglyPopularVote(predictions, confidence),groundtruth[i]))
        hpTotals.append(checkAnswer(honeypot(predictions, trap_true),groundtruth[i]))
        whTotals.append(checkAnswer(weighted_honeypot(predictions, trap_true),groundtruth[i]))
        eTotals.append(checkAnswer(ELICE(predictions, groundtruth[i], trap_true, trap_false),groundtruth[i]))

print(str("---------------------- Totals ------------------------"))

'''
print('Majority Vote Totals: ' + sum())

print('Confidence-Weighted Winner: ' + )

print('High Confidence Winner: ' + )

print('SP Winner: ' + )

print('Honeypot Winner: ' + )

print('Weighted Honeypot Winner: ' + )

print('ELICE: ' + )
'''


         





