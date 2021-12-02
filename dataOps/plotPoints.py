import json
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import numpy as np

with open('11-24-2021C_Data_10-90_v2.json') as f:
    data = json.load(f)

array = []
for i in range(0,33):
    if(data[i]['1']['q1'] == 1):
        x = data[i]['1']['bb']['startX']
        y = data[i]['1']['bb']['startY']
        w = data[i]['1']['bb']['w']
        h = data[i]['1']['bb']['h']



        if(w != None and h != None):
            print("x = ",x)
            print("y = ",y)
            print("w = ",w)
            print("h = ",h)
            print()
            newW = w/2
            newH = h/2

            cx = x+newW
            cy = y+newH

            cx = (cx*1080)/500
            cy = (cy*1080)/500
            if(cx <= 1080 and cy <= 1080 and cx > 0 and cy > 0):
                array.append((cx,cy))
        #print(i)

print(array)

m = max(array)

print("MAX : ",m)

image = mpimg.imread("img-1.png")
pts = np.array(array)

plt.imshow(image)
#plt.plot(640, 570, "og", markersize=5)  # og:shorthand for green circle
plt.scatter(pts[:, 0], pts[:, 1], marker="o", color="red", s=20)
plt.show()
