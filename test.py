from flask import Flask, request
import socket

app = Flask(__name__)

picoIP = '192.168.1.60'

@app.route('/')
def home():
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((picoIP, 5000))
        msg = s.recv(1024)
        _msg = msg.decode("utf-8")
        print(_msg)
        return f"<p>test {_msg} </p>"

app.run("0.0.0.0", 5000, debug=True)
