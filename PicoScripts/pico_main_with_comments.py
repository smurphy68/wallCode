## = Notes
# = Commented out code

## importing modules that are used in the program. "machine" and "utime" are modules specific to Micropython
## micropython documentation: https://docs.micropython.org/en/latest/
from machine import UART, Pin
import utime

## initialisation of on-board led indicator
## https://www.instructables.com/Raspberry-Pi-Pico-Getting-Started-on-Board-Blink-L/
led_indicator = Pin(25, Pin.OUT)

## defining function for making a pin high voltage .on() then low voltage .off()
def flash(led_to_flash):
    led_to_flash.on()
    utime.sleep(0.25)
    led_to_flash.off()
    utime.sleep(0.25)

## first flash call to check the pico has power and is running the script    
flash(led_indicator)

## defining the holf class which controls the state of the three RGB pins per hold
class Hold():
    ## initiallising the Hold and setting its pin-out
    def __init__(self, r, g, b, state="start"):
        ## start, route, foot or end
        self.State = state
        ## location of the pins on the pico ( r, g and b )
        self.R = Pin(r, Pin.OUT)
        self.G = Pin(g, Pin.OUT)
        self.B = Pin(b, Pin.OUT)

        ## the leds are common cathode so the default state for the pins in low (on, 0) and the leds light up on initialisation.
        ## setting all of the led pins high (off, 1) so they arent on from initialisation.
        self.R.value(1)
        self.G.value(1)
        self.B.value(1)
    
    ## defines a reset method which sets all the pins in the Hold high (off, 1)
    def reset(self):
        self.R.value(1)
        self.G.value(1)
        self.B.value(1)
        self.State = "start"
    
    ## test used during development to check that the leds were wired up correctly and the console was printing on the pico
    def test(self):
        ## makes each led high then low three times with an interval
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
    
    ## sets the state of the Hold by reseting all of the Hold pins, then setting a new state and bringing the relevant pins low (on)
    def setHold(self, newState):
        self.reset()
        ## setting property of the hold to the newState variable
        self.State = newState
        self.lightUp()

    ## comparing the state of the Hold, then bringing the relevant pins low (on)
    def lightUp(self):
        if self.State == "start":
            ## e.g if the hold is a start hold, bring the pin stored in mempry at self.G low making the LED green
            self.G.value(0)
        elif self.State == "route":
            self.B.value(0)
        elif self.State == "end":
            self.R.value(0)
        elif self.State == "foot":
            self.R.value(1)
            self.G.value(0)
            self.B.value(0)

## a custom dictionary with all of the holds on the pico, each pico hosts different holds
## later in the scipt the commands from the pico-w (wifi enabled pico) are parsed into the keys
##    (i.e. "hold22") is accessed by using holdDict["hold22"] >>> Hold
## and we can access each individual hold
holdDict = {
        "hold22": Hold(5, 4, 3),
        "hold23": Hold(8, 7, 6),
        "hold24": Hold(12, 11, 10),
        "hold25": Hold(15, 14, 13),
        "hold30": Hold(16, 17, 18),
        "hold31": Hold(20, 21, 22),
        "hold32": Hold(26, 27, 28)
    }

## each Hold is activate_led_to_new_stated by Hold.activate_led_to_new_state([key in holdDict], [new state of Hold])
def activate_led_to_new_state(hold, state):
    ## sends a string back to the pico-w through UART port (covered later). Used in development but the pico-w doesnt have a read capability in it anymore
    if hold not in holdDict.keys():
        uart.write("Hold not in hold Dictionary!")
    else:
        ## local variable _hold used within the function scope only
        _hold = holdDict[hold]
        ## "reset" is the default state and probably should have just been "off" from the start...
        if state == "reset":
            ## resets hold
            _hold.reset()
            ## onboard LED flashes
            flash(led_indicator)
        else:
            ## if the command is not reset, the hold is set to whatever new state comes through the UART      
            _hold.setHold(state)
            ## this too, is redundant
            uart.write("activate_led_to_new_state {} as a {} hold.".format(str(hold), str(state)))

## initialising UART communication built into the pico, this is a two way serial communication port that needs two pins; a transmitter and a reciever Tt and Tr.
## https://docs.micropython.org/en/latest/rp2/quickref.html
uart = UART(0, baudrate=9600)
uart.init(9600, bits=8, parity=None, stop=1, tx=Pin(0), rx=Pin(1))

## used for debugging when the REPL is available.
#print("UART initiated")

## defines a method to identify when the UART is storing any information and retrieving that information
def readCommand():
    ## the data is transmitted by the pico-w through the UART one [hold:state] pair at a time
    ## if the UART has any bytes in it:
    if uart.any() > 3:
        ## print debugging info to REPL
        # print("UART Working")
        ## get message_from_uart and store it in a variable, string methods to trim off the x00 bytes chars
        message_from_uart = ((str(uart.read()).strip("b").strip("'"))).replace("\\x00", "")
        ## if there is a spaces in the message, split it into a list (list_message)
        if " " in message_from_uart:           
            ## stores a list of all of the strings seperated by single whitespace chars
            list_message = [((x.strip("b")).strip("'")).replace("\\x00", "") for x in message_from_uart.split(" ")]
            ## store hold name in variable
            hold = list_message[0]
            ## store state in variable
            state = list_message[1]
            ## flash onboard LED to show things are working
            flash(led_indicator)
            ## make the LED reflect display the right colour
            activate_led_to_new_state(hold, state) 
        else:
            ## if the message is "reset", make all of the holds on the board change state to "reset" (as before "off" would have worked just as well)
            if message_from_uart == "reset":
                for hold in holdDict.values():
                    hold.reset()

## whilst True resolves to True i.e. forever this loop will poll the UART port to see if there is anything to read.                    
while True:
    try:
        ## if readCommand() throws an error it will execute the except block beneath it which passes the loop to the next iteration
        readCommand()
    except:
        ## if any type errors are thrown by readCommand() the next loop with start
        pass
        
        



