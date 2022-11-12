import cv2 as cv
import numpy as np
import pandas as pd

def isBetween(point, min, max):
    if point <= max and point >= min:
        return True
    else:
        return False

def rectanglePoints(rect):
    #A----------#B #A----------#B 
    #|          #| #|          #|
    #C----------#D #C----------#D
    
    #A----------#B
    #|          #|
    #C----------#D
    x, y, w, h = rect
    c = [x,y]
    a = [x,y+h]
    b = [x+w, y+h]
    d = [x+w, y]
    return [a,b,c,d]

def isWithin(recta, rectb):
    _recta = rectanglePoints(recta)
    _rectb = rectanglePoints(rectb)

    _test = []

    for coord in _rectb:
        _maxx = max(_recta[0][0], _recta[1][0], _recta[2][0], _recta[3][0])
        _minx = min(_recta[0][0], _recta[1][0], _recta[2][0], _recta[3][0])
        _maxy = max(_recta[0][1], _recta[1][1], _recta[2][1], _recta[3][1])
        _miny = min(_recta[0][1], _recta[1][1], _recta[2][1], _recta[3][1])

        if isBetween(coord[0], _minx, _maxx):
            _test.append(False)
        else:
            _test.append(True)
        if isBetween(coord[1], _miny, _maxy):
            _test.append(False)
        else:
            _test.append(True)
    #print(_test)
    if all(_test) == False:
        return True
    else:
        return False
        

    #xa, ya, wa, ha = recta
    #xb, yb, wb, hb = rectb

    #R1 = [xa, ya, xa+wa, ya+ha]
    #R2 = [xb, yb, xb+wb, yb+hb]

    #if R1[0]>=R2[2] or R1[2]<=R2[0] or R1[3]<=R2[1] or R1[1]>=R2[3]:
    #    return False
    #else:
    #    return True

img = cv.imread("Board.png")
imgGray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
imgBlurred = cv.GaussianBlur(imgGray, (3,3), 0)
imgCanny = cv.Canny(imgBlurred, 100, 100)
cnts = cv.findContours(imgCanny, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
cnts = cnts[0] if len(cnts) == 2 else cnts[1]
#print(cnts)

shortlist = {}

counter = 0
for c in cnts:
    height, width, channels = img.shape
    x,y,w,h = cv.boundingRect(c)
    #break
    if isBetween(w, width*0.02, width*0.15) and isBetween(h, width*0.02, width*0.15):
        #print(x,y,w,h)
        shortlist.update({"boardEdge "+str(counter): [x,y,w,h]})
        counter +=1
    #cv.rectangle(imgCanny, (x,y), (x+w, y+h),(0,255,0),2)   
    #cv.imwrite("boardEdges.png", imgCanny)

#boardEdges = cv.imread("boardEdges.png")
    
windowName = "Image"
keys = shortlist.keys()
for key in keys:
    for key1 in keys:
        if isWithin(shortlist[key1], shortlist[key]) == True and key != key1:
            #print(key, key1)
            pass
        else:
            x,y,w,h = shortlist[str(key)]
            #print(x,y,w,h)
            cv.rectangle(img, (x,y), (x+w, y+h),(255,0,0), 2)

cv.imshow(windowName, img)
cv.waitKey(0)
cv.imshow("Canny", imgCanny)
#cv.imwrite()
cv.waitKey(0)
#print(shortlist["boardEdge 0"])

