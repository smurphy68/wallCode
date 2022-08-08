from flask import Flask, request
import pandas as pd
import cv2 as cv
import os
import socket

HEADER = 64
PORT = 5050
FORMAT = 'utf-8'
DISCONNECT_MESSAGE = "!DISCONNECT"
SERVER = "192.168.1.60"
ADDR = (SERVER, PORT)
cwd = os.getcwd()

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

app = Flask(__name__)

#functions

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

def send(msg):
    message = msg.encode(FORMAT)
    msg_length = len(message)
    send_length = str(msg_length).encode(FORMAT)
    send_length += b' ' * (HEADER - len(send_length))
    client.send(send_length)
    client.send(message)
    print(client.recv(2048).decode(FORMAT))

#class's

class Hold():
    def __init__(self, name, state="reset"):
        name = self.name
        state = self.state
    
    def changeState(self, state):
        opt = ["start", "route", "foot", "end", "reset"]
        for i in range(0, len(opt)):
            if opt == state:
                if i+1 > len(opt):
                    self.state = opt[0]
                else:
                    self.state = opt[i+1]
        
        #transmitting
              
        client.connect(ADDR)
        print("Connected to server")
        send(f"{Hold.name} {Hold.state}")
                

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

#app.run("0.0.0.0", 5000, debug=True)


#print('Hello, Simon')
