import json
import math

#load json file
with open('07-23-2021Test_SURI_hb.json') as f:
    data = json.load(f)
tn = 0
tp = 0
fn = 0
fp = 0
#specify ground truth for each question
groundtruth = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0]
tnA = []
fnA = []
fpA = []
tpA = []

for i in range(len(data)):
    print(data[i]["name"])
    tn = 0
    tp = 0
    fn = 0
    fp = 0
    for j in range(24):
        if(data[i][str(j+1)]["q1"] == 0 and groundtruth[j] == 0):
            tn = tn+1
        elif(data[i][str(j+1)]["q1"] == 0 and groundtruth[j] == 1):
            fn = fn+1
        elif(data[i][str(j+1)]["q1"] == 1 and groundtruth[j] == 1):
            tp = tp+1
        else:
            fp = fp+1
    print(tn)
    tnA.append(tn)
    tpA.append(tp)
    fnA.append(fn)
    fpA.append(fp)

#average fnr:
sum = 0
avg = 0
for x in fnA:
	sum = sum+x
print("Total entries = "+str(len(fnA)))
print(sum)
avg = sum/len(fnA)
print("Average FNR = "+str(avg))
