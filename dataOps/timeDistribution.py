import json
import matplotlib.pyplot as plt
import seaborn as sns

#load json file
with open('12-03-2020Test2-2.json') as f:
    data = json.load(f)

groundtruth = [1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0]

TimeDist = []

#iterate through users
for i in range(len(data)):
    #find average time spent
    times = []
    for j in range(1,25):
        response = data[i][str(j)]
        time = response["time"]
        times.append(time)

    avgTime = sum(times) / len(times)
    TimeDist.append(avgTime)

TimeDist.sort()
print(TimeDist)

x_pos = x_pos = [i for i, _ in enumerate(TimeDist, 1)]
scatter = sns.scatterplot(x = x_pos, y = TimeDist)
plt.ylabel('Average Time Spent')
plt.xlabel('User ID')
plt.show()