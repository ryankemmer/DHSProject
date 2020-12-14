import json
import matplotlib.pyplot as plt
from sklearn import linear_model
import numpy as np
from scipy.stats.stats import pearsonr 
import seaborn as sns

with open('12-02-2020Test2-1.json') as f:
    data = json.load(f)

#specify ground truth for each question
groundtruth = [1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0]

times = []
correctAnswer = []

for i in range(1,25):

    for userResponse in data:
        response = userResponse[str(i)]
        times.append(response["time"])
        userAnswer = response["q1"]

        correct = None
        #check if correct
        if userAnswer == groundtruth[i-1]:
            correct = 1
        else:
            correct = 0

        correctAnswer.append(correct)

corr, _ = pearsonr(times, correctAnswer)
print(corr)

#calculate correlation
plt.scatter(times, correctAnswer)

sns.regplot(x=times, y=correctAnswer, data=data, logistic=True)

#plt.clf()
plt.xlabel("Time (seconds)")
plt.ylabel("Correct/Incorrect")
plt.ylim(-.25, 1.25)
plt.xlim(0, 70)
plt.show()

