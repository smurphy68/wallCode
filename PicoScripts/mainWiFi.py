from secrets import SSID, password
from machine import Pin, UART
import socket
import network
import utime
import rp2

## Set up indicator on pico board
ind = Pin("LED", Pin.OUT)

## Initialize UART
uart1 = UART(0, baudrate=9600)
uart1.init(9600, bits=8, parity=None, stop=1, tx=Pin(0), rx=Pin(1))

## needed for the UART timings
rp2.country("GB")

## SETUP
HEADER = 588
PORT = 5000
## Pi Pico server address
SERVER = 'XXX.XXX.X.XX'
ADDR = (SERVER, PORT)
## Format of bytes
FORMAT = 'utf-8'
## Disconnect watch term
DISCONNECT_MESSAGE = "!DISCONNECT"

## Used to flash on board LED as no repl avaliable when wired in.
def flash(_led):
    _led.on()
    utime.sleep(0.25)
    _led.off()
    utime.sleep(0.25)

## Writes recieved commands through the server socket to the common UART.
def sendCommand(message):
    uart1.write(message)
    flash(ind)

## Sends each element of a route using the sendCommand function.
def sendRoute(route):
    for i in route:
        sendCommand(i)
        utime.sleep(0.005)

## Parses the commands recieved from the client.
def handleClient(conn, addr):
    connected = True
    while connected == True:
        msg_length = (conn.recv(HEADER)).decode(FORMAT)
        if msg_length:
            msg_length = float(msg_length)
            msg = conn.recv(msg_length).decode(FORMAT)
            if "hold" in msg.split(" ", 1)[0] and len(msg.split(" ")) <= 2:
                sendCommand(msg)
            elif DISCONNECT_MESSAGE not in msg:
                sendRoute(msg.split(", "))
            elif msg == DISCONNECT_MESSAGE:
                connected = False
                conn.send("Ending session".encode(FORMAT))
            print(f"[{addr}] {msg}")
            conn.send("Message Recieved".encode(FORMAT))
    conn.close()
    
## Start server
def start():
    server.listen()
    print(f"[LISTENING] Server is listening on {SERVER}")
    while True:
        conn, addr = server.accept()
        handleClient(conn, addr)    

## Configure wifi module
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(SSID, password)

## Define a max timeout
max_wait = 15


## If the max_wait is elapsed a connection error is raised and the indicator LED is set to on.
while max_wait > 0:
    if wlan.status() <0 or wlan.status() >= 3:
        break
    max_wait -= 1
    print("Waiting for connection ...")
    utime.sleep(1)

if wlan.status() != 3:
    raise RuntimeError('Network connection failed.')
else:
    print('Connected!')
    ind.on()
    status = wlan.ifconfig()
    print('ip = ' +status[0])
print(wlan.ifconfig())

## The server will bind to the declared port on the local network
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(ADDR)

## One time call into infinite loop
start()
    

