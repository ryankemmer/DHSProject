import json
import csv

# field names
fields = ['Time', 'X', 'Y']

with open('11-08-2021Test4_4_1.json') as f:
    data = json.load(f)

# name of csv file
filename = "coordinates.csv"
rows = []

for i in range(2):
    print("None")
    for x in data[i]["27"]['mouseinfo']:
        print(x)
        rows.append(x)

# writing to csv file
with open(filename, 'w') as csvfile:
    # creating a csv writer object
    csvwriter = csv.writer(csvfile)

    # writing the fields
    csvwriter.writerow(fields)

    # writing the data rows
    csvwriter.writerows(rows)
