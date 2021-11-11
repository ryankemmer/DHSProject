import cv2.cv as cv

mouseinfo = [[52.7, 487, 454], [52.5, 443, 368], [52.4, 327, 230], [52.2, 303, 216], [52, 305, 250], [51.8, 305, 256]]
for mi in mouseinfo:
    x = mouseinfo[0]
    y = mouseinfo[2]
    image = cv2.circle(image, (x,y), radius=0, color=(0, 0, 255), thickness=-1)
