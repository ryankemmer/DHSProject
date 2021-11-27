import json
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import numpy as np

with open('11-24-2021C_Data_10-90_v2.json') as f:
    data = json.load(f)

array = []
for i in range(0,33):
    x = data[i]['1']['bb']['startX']
    y = data[i]['1']['bb']['startY']
    w = data[i]['1']['bb']['w']
    h = data[i]['1']['bb']['h']

    if(w != None and h != None):

        newW = abs(w)/2
        newH = abs(h)/2
        if(w < 0):
            cx = x-newW
        else:
            cx = x+newW

        if(h < 0):
            cy = y-newH
        else:
            cy = y+newH
        array.append((cx,cy))
    #print(i)

print(array)

image = mpimg.imread("img-1.png")
pts = np.array(array)

plt.imshow(image)
#plt.plot(640, 570, "og", markersize=5)  # og:shorthand for green circle
plt.scatter(pts[:, 0], pts[:, 1], marker="o", color="red", s=20)
plt.show()
