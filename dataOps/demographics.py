import json
import sys

filename = sys.argv[1]
print(filename)
with open(filename) as f:
    data = json.load(f)

menCount = 0
womenCount = 0
otherCount = 0

noHighSchool = 0
GED_HS = 0
someCollege = 0
College2D = 0
College4D = 0
CollegeMD = 0
CollegePhD = 0
Professional = 0

for i in range(0,33):
    #gender counts
    if(data[i]["demographic"]["gender"] == "Female"):
        womenCount = womenCount+1
    elif(data[i]["demographic"]["gender"] == "Male"):
        menCount = menCount+1
    else:
        otherCount = otherCount+1

    #degree counts
    if(data[i]["demographic"]["education"] == "Less than High School"):
        noHighSchool = noHighSchool+1
    elif(data[i]["demographic"]["education"] == "High School/GED"):
        GED_HS = GED_HS+1
    elif(data[i]["demographic"]["education"] == "Some College"):
        someCollege = someCollege+1
    elif(data[i]["demographic"]["education"] == "2 year degree"):
        College2D = College2D+1
    elif(data[i]["demographic"]["education"] == "4 year degree"):
        College4D = College4D+1
    elif(data[i]["demographic"]["education"] == "Master's"):
        CollegeMD = CollegeMD+1
    elif(data[i]["demographic"]["education"] == "Doctoral"):
        CollegePhD = CollegePhD+1
    elif(data[i]["demographic"]["education"] == "Professional (MD, JD, etc.)"):
        Professional = Professional+1
print("WOMEN: ",womenCount)
print("MEN: ",menCount)
print("OTHER: ",otherCount)
print()
print("Less than HS: ",noHighSchool)
print("HS: ",GED_HS)
print("Some college: ",someCollege)
print("2 year college: ",College2D)
print("4 year college: ",College4D)
print("masters ",CollegeMD)
print("PhD ",CollegePhD)
print("Professional ",Professional)
