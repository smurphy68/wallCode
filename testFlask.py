from flask import Flask, request
import socket

host = '192.168.1.14'
picoIP = '192.168.1.60'
port = 5000

#start server
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(("localhost", 1234))

s.listen(5)

app = Flask(__name__)

@app.route('/')
def home():
    clientsocket, address = s.accept()
    print(f"Board connected from {address}!")
    clientsocket.send(bytes("hold1 on", 'utf-8'))
    return "test"

app.run('0.0.0.0', 5000, debug=True)