from secrets import SSID, password
from machine import Pin, UART
import socket
import network
import utime
import rp2
import _thread

ind = Pin("LED", Pin.OUT)
        
uart1 = UART(0, baudrate=9600)
uart1.init(9600, bits=8, parity=None, stop=1, tx=Pin(0), rx=Pin(1))

       
rp2.country("GB")
firstAscent = ["hold1 route", "hold2 end"]
HEADER = 64
PORT = 5050
SERVER = '192.168.1.60'
ADDR = (SERVER, PORT)
FORMAT = 'utf-8'
DISCONNECT_MESSAGE = "!DISCONNECT"

def flash(_led):
    for i in range(0, 3):
        _led.on()
        utime.sleep(0.5)
        _led.off()
        utime.sleep(0.5)
        
def sendCommand(message):
    uart1.write(message)
    flash(ind)
    print(message+" from UART")
    #print("message: '{}' sent!".format(message))

def sendRoute(route):
    for i in route:
        sendCommand(i)
        utime.sleep(0.1)

def handle_client(conn, addr):
    print(f"[NEW CONNECTION] {addr} connected.")

    connected = True
    while connected == True:
        msg_length = (conn.recv(HEADER)).decode(FORMAT)
        if msg_length:
            msg_length = int(msg_length)
            msg = conn.recv(msg_length).decode(FORMAT)
            if "hold" in msg.split(" ", 1)[0]:
                sendCommand(msg)
                utime.sleep(0.1)
            elif msg == DISCONNECT_MESSAGE:
                connected = False
                conn.send("Ending session".encode(FORMAT))
            print(f"[{addr}] {msg}")
            conn.send("Msg received".encode(FORMAT))
    conn.close()
    
    
def start():
    server.listen()
    print(f"[LISTENING] Server is listening on {SERVER}")
    while True:
        conn, addr = server.accept()
        #thread = _thread.start_new_thread(handle_client, (conn, addr))
        handle_client(conn, addr)    
        #thread = threading.Thread(target=handle_client, args=(conn, addr))
        #thread.start()
        #print(f"[ACTIVE CONNECTIONS] {threading.activeCount() - 1}")


wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(SSID, password)

max_wait = 15

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
    flash(ind)
    status = wlan.ifconfig()
    print('ip = ' +status[0])

print(wlan.ifconfig())

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(ADDR)

print("[STARTING] server is starting...")
start()
    


