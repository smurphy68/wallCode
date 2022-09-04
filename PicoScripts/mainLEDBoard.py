from machine import UART, Pin
import utime

ind = Pin(25, Pin.OUT)

def flash(led):
    led.on()
    utime.sleep(0.25)
    led.off()
    utime.sleep(0.25)
    
flash(ind)

class Hold():
    def __init__(self, r, g, b, state="start"):
        self.State = state
        self.R = Pin(r, Pin.OUT)
        self.G = Pin(g, Pin.OUT)
        self.B = Pin(b, Pin.OUT)
        
        self.R.value(1)
        self.G.value(1)
        self.B.value(1)
    
    def reset(self):
        self.R.value(1)
        self.G.value(1)
        self.B.value(1)
        self.State = "start"
    
    def test(self):
        for i in range(0, 3):
            self.R.value(0)
            print("Flash!")
            utime.sleep(0.1)
            self.R.value(1)
            utime.sleep(0.1)
        for i in range(0, 3):
            self.G.value(0)
            print("Flash!")
            utime.sleep(0.1)
            self.G.value(1)
            utime.sleep(0.1)
        for i in range(0, 3):
            self.B.value(0)
            print("Flash!")
            utime.sleep(0.1)
            self.B.value(1)
            utime.sleep(0.1)
        
        
    def __repr__(self):
        return "I am a {} hold!".format(self.State)
    
        
    def setHold(self, newState):
        self.reset()
        self.State = newState
        self.lightUp()
           
    def lightUp(self):
        if self.State == "start":
            self.G.value(0)
        elif self.State == "route":
            self.B.value(0)
        elif self.State == "end":
            self.R.value(0)
        elif self.State == "foot":
            self.R.value(1)
            self.G.value(0)
            self.B.value(0)

hold1 = Hold(5, 4, 3, "start")
hold2 = Hold(8, 7, 6, "start")
hold3 = Hold(12, 11, 10, "start")
hold4 = Hold(21, 20, 19, "start")
hold5 = Hold(28, 27, 26, "start")
hold6 = Hold(18, 17, 16, "start")
hold7 = Hold(28, 27, 26, "start")



holdDict = {'hold1': hold1,  'hold2': hold2,  'hold3': hold3, 'hold4': hold4, 'hold5': hold5, 'hold6': hold6, 'hold7': hold7}

def activate(hold, state):
    if hold not in holdDict.keys():
        uart.write("Hold not in hold Dictionary!")
    else:
        _hold = holdDict[hold]
        if state == "reset":
            _hold.reset()
            flash(ind)
        else:      
            _hold.setHold(state)
            uart.write("Activate {} as a {} hold.".format(str(hold), str(state)))
        

uart = UART(0, baudrate=9600)
uart.init(9600, bits=8, parity=None, stop=1, tx=Pin(0), rx=Pin(1))

def readCommand():
    if uart.any() > 3:
        option1 = ((str(uart.read()).strip("b").strip("'"))).replace("\\x00", "")
        option2 = option1
        if " " in option1:            
            st = option1
            lst = [((x.strip("b")).strip("'")).replace("\\x00", "") for x in st.split(" ")]
            print(lst)
            hold = lst[0]
            state = lst[1]
            flash(ind)
            activate(hold, state) 
        else:
            st = option2
            if st == "reset":
                for i in holdDict.values():
                    i.reset()
            
    
        
while True:
    try:
        readCommand()
    except:
        pass
        
        
