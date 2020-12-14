import json
import matplotlib.pyplot as plt
import seaborn as sns

#load json file
with open('12-02-2020Test2-1.json') as f:
    data = json.load(f)

groundtruth = [1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0]

timeDist = []

#iterate through users
for i in range(len(data)):
    times = []
    for j in range(1,25):
        response = data[i][str(j)]
        time = response["time"]
        times.append(time)

    avgTime = sum(times) / len(times)
    timeDist.append(avgTime)

timeDist.sort()
print(timeDist)

x_pos = x_pos = [i for i, _ in enumerate(timeDist, 1)]
scatter = sns.scatterplot(x = x_pos, y = timeDist)
plt.ylabel('Average Time Spent')
plt.xlabel('User ID')
plt.show()