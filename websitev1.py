from flask import Flask, request, redirect
import pandas as pd
import os
import socket
import time

HEADER = 64
PORT = 5050
FORMAT = 'utf-8'
DISCONNECT_MESSAGE = "!DISCONNECT"
SERVER = "192.168.1.60"
ADDR = (SERVER, PORT)
cwd = os.getcwd()

app = Flask(__name__)




    
#class's

class Hold():
    def __init__(self, name, state="off"):
        self.name = name
        self.state = state
    
    def changeState(self):
        j = 0
        opt = ["start", "route", "foot", "end", "off"]
        for i in range(0, len(opt)):
            if self.state == opt[i]:
                j = i
        if j + 1 > len(opt)-1:
            self.state = opt[0]
        else:
            self.state = opt[j+1]
      
        #transmitting
        connect(self)
        client.close()

#functions

def htmltoString(route):
    with open(route, "r", encoding="utf-8") as file:
        contents = file.readlines()
        html = "".join(contents)
        return html

def extractDataframe(vrequest):
    temp = str(vrequest).split("&")
    temp2 =[x.split("=") for x in temp]

    df = pd.DataFrame([
        {
            "User": temp2[0][1],
            "Name of Route": temp2[1][1], 
            "Grade of Route": temp2[2][1], 
            "Number of Attempts": temp2[3][1].strip("' [GET]>")}])
    return df

def connect(hold):      
    global client
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect(ADDR)
    print("[CONNECTED] Client is connected to server...")
    print(f"[SENDING] Client is sending command '{hold.name} {hold.state}' to the server...")
    send(f"{hold.name} {hold.state}")
    send(DISCONNECT_MESSAGE)
    
def send(msg):
    message = msg.encode(FORMAT)
    msg_length = len(message)
    send_length = str(msg_length).encode(FORMAT)
    send_length += b' ' * (HEADER - len(send_length))
    client.send(send_length)
    client.send(message)
    print(f"[RESPONSE] {client.recv(2048).decode(FORMAT)}...")

#class variables

holdDict = {"hold1": Hold("hold1"), "hold2": Hold("hold2"), "hold3": Hold("hold3"), "hold4": Hold("hold4"), "hold5": Hold("hold5"),
 "hold6": Hold("hold6"), "hold7": Hold("hold7"), "hold8": Hold("hold8"), "hold9": Hold("hold9"), "hold10": Hold("hold10"),
 "hold11": Hold("hold11"), "hold12": Hold("hold12"), "hold13": Hold("hold13"), "hold14": Hold("hold14"), "hold15": Hold("hold15"),
 "hold16": Hold("hold16"), "hold17": Hold("hold17"), "hold18": Hold("hold18"), "hold19": Hold("hold19"), "hold20": Hold("hold20"), 
 "hold21": Hold("hold21"), "hold22": Hold("hold22"), "hold23": Hold("hold23"), "hold24": Hold("hold24"), "hold25": Hold("hold25"), 
 "hold26": Hold("hold26"), "hold27": Hold("hold27"), "hold28": Hold("hold28"), "hold29": Hold("hold29"), "hold30": Hold("hold30"),
 "hold31": Hold("hold31"), "hold32": Hold("hold32"), "hold33": Hold("hold33"), "hold34": Hold("hold34"), "hold35": Hold("hold35"),
 "hold36": Hold("hold36"), "hold37": Hold("hold37"), "hold38": Hold("hold38"), "hold39": Hold("hold39"), "hold40": Hold("hold40"),
 "hold41": Hold("hold41"), "hold42": Hold("hold42"), "hold43": Hold("hold43"), "hold44": Hold("hold44"), "hold45": Hold("hold45"),
 "hold46": Hold("hold46"), "hold47": Hold("hold47"), "hold48": Hold("hold48"), "hold49": Hold("hold49"),"hold50": Hold("hold50"),
 "hold51": Hold("hold51"), "hold52": Hold("hold52"), "hold53": Hold("hold53"), "hold54": Hold("hold54"), "hold55": Hold("hold55"),
 "hold56": Hold("hold56"), "hold57": Hold("hold57"), "hold58": Hold("hold58"), "hold59": Hold("hold59"), "hold60": Hold("hold60"),
 "hold61": Hold("hold61"), "hold62": Hold("hold62"), "hold63": Hold("hold63"), "hold64": Hold("hold64"), "hold65": Hold("hold65"),
 "hold66": Hold("hold66"), "hold67": Hold("hold67"), "hold68": Hold("hold68"), "hold69": Hold("hold69"), "hold70": Hold("hold70"), 
 "hold71": Hold("hold71"), "hold72": Hold("hold72"), "hold73": Hold("hold73"), "hold74": Hold("hold74"), "hold75": Hold("hold75")}

hold1 = Hold("hold1")
hold2 = Hold("hold2")

@app.route('/')
def homePage():
    return """
    <html lang="en">
        <head>
            <title>Milestone Wall</title>
            <style type="text/css">
                table {border-collapse:separate;}
                td {font-size:1.2em;}
                a:link {text-decoration: none;}
                a:visited {text-decoration: none;}
                a:hover {text-decoration: none;}
                a:active {text-decoration: none;}
            </style>
        </head>
        <body>
            <h1>Milestone Wall</h1>
                <p><a href="./">Home<a></p>
                <p><a href="./Routes">the Record<a></p>
                <p><a href="./Set">the Forge<a></p><div></div>
                <p>Welcome to Milestone Wall, our safety features are limited but the staff are great!</p>
                <h2> <a href="./Routes">The Record</a></h2>
                        <p>"The Record" takes note of all of your crushing. Get to it!</p>
                    <h2> <a href="./Set">Set a Problem</a></h2>
                        <p>Click the title to navigate to the Forge</p>
        </body>      
    </html>
        
    """

@app.route('/Routes')
def theRecord():
    time.sleep(0.25)
    with open('TheRecord.csv',"r", encoding="UTF-8") as file:
        df = pd.read_csv(file, index_col=[0])
        #print(df)
    instance = df.to_html(index=False, columns=["User",	"Name of Route", "Grade of Route", "Number of Attempts"])
    #print(instance)
    return """
    <head>
        <title>Milestone Wall</title>
    </head>
    <body>
        <h1>The Record</h1>
            <p><a href="./">Home<a></p>
            <p><a href="./Routes">the Record<a></p>
            <p><a href="./Set">the Forge<a></p><div></div>
        <h2>Table</h2>
            <table>
                {}
            </table>
                <p><a href="./Routes">Refresh<a></p>
    </body>
    """.format(str(instance))

@app.route('/Set')
def theForge():
    return """
    <head>
        <title>Milestone Wall</title>
    </head>
    <body>
        <h1>The Forge</h1>
            <p><a href="./">Home<a></p>
            <p><a href="./Routes">the Record<a></p>
            <p><a href="./Set">the Forge<a></p><div></div>
        <h2>Set a Route!</h2>
            <form action="/SubmitRoute">
                <label for="User">User:</label><br>
                <input type="text" id="User" name="User" value="Name"><br>
                <label for="Route Name">Name of Route:</label><br>
                <input type="text" id="Name" name="Name" value="Route Name"><br>
                <label for="Route Grade">Grade of Route:</label><br>
                <input type="text" id="Grade" name="Grade" value="Route Grade"><br>
                <label for="Number of Attempts">Number of Attempts</label><br>
                <input type="text" id="Attempts" name="Attempts" value="Number of Attempts"><br><br>
                <input type="submit" value="Submit">
            </form>
        <h2>Select Holds!</h2>
            <img src="Board.png" width="500" height="600" />
    </body>
    """
@app.route('/SubmitRoute', methods=["POST", "GET"])
def addRoute(): 
    if request.method == "GET":
        df1 = extractDataframe(request)
        with open("TheRecord.csv", "r", encoding="UTF-8") as file:
            df = pd.read_csv(file)
            file.close()
            df = df.append(df1)
            #print(df)
            df.to_csv("TheRecord.csv", encoding="UTF-8")
        return """
    <head>
        <title>Milestone Wall</title>
    </head>
    <body>
        <h1>The Forge</h1>
            <p><a href="./">Home<a></p>
            <p><a href="./Routes">the Record<a></p>
            <p><a href="./Set">the Forge<a></p><div></div>
        <h2>Set a Route!</h2>
            <form action="/SubmitRoute">
                <label for="User">User:</label><br>
                <input type="text" id="User" name="User" value="Name"><br>
                <label for="Route Name">Name of Route:</label><br>
                <input type="text" id="Name" name="Name" value="Route Name"><br>
                <label for="Route Grade">Grade of Route:</label><br>
                <input type="text" id="Grade" name="Grade" value="Route Grade"><br>
                <label for="Number of Attempts">Number of Attempts</label><br>
                <input type="text" id="Attempts" name="Attempts" value="Number of Attempts"><br><br>
                <input type="submit" value="Submit">
            </form>
        <h2>Select Holds!</h2>
            <img src="Board.png" width="500" height="600" />
    </body>
    """
    else:
        return "Route not Added! Experiencing an Error!"

#TESTING

#@app.route("/onClick")
#def onClick():
#    hold2.changeState()
#    #client.close()
#    #print(hold1.state)
#    return redirect("/test", 302)

#@app.route("/test")
#def test():
#    return f'''<button type="button" onclick=window.location.href="/onClick">{hold2.state}</button>'''

#@app.route("/htmltest")
#def htmltest():
#    return htmltoString("test.html").format(hold="hold2", holdState=hold2.state)

#TESTING

@app.route("/onClick/<hold>")
def onClick(hold):
    holdDict[str(hold)].changeState()
    return redirect("/test", 302)


@app.route("/test")
def test():
    return htmltoString("test.html").format(hold1state=str(hold1.state), hold2state=str(hold2.state))


app.run("0.0.0.0", 5000, debug=True)


#print('Hello, Simon')
