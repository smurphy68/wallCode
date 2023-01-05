from machine import UART, Pin
import utime

update = False
ind = Pin(25, Pin.OUT)
green = Pin(15, Pin.OUT)
white = Pin(16, Pin.OUT)
uart = UART(0, baudrate=9600)
uart.init(9600, bits=8, parity=None, stop=1, tx=Pin(0), rx=Pin(1))

def flash(led):
    led.on()
    utime.sleep(0.25)
    led.off()
    utime.sleep(0.25)

def make_update_file(new_script):
    with open("./update.py", "w", encoding="utf-8") as new:
        print("making file")
        new.writelines(new_script)
        new.close()

def run_new():
    try:
        #print("new file found!")
        import update
        update.main()
    except:
        #print("No update available")
        pass

def readCommand():
    if uart.any() > 3:
        message = uart.read()
        update = True
        uart.write(new_script)
        return new_script
    return
        
## Main loop ##
for i in range(0, 3):
    flash(ind)        

while True:
    white.off()
    green.on()
    utime.sleep(1)
    green.off()
    utime.sleep(1)
    try:
        new_script = readCommand()
        if update == True:
            make_update_file(new_script)
            break            
    except:
        pass
        
## New Loop ##
uart.deinit()
run_new()
