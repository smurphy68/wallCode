test = """from machine import UART, Pin\nimport utime\n\nupdate = False\nind = Pin(25, Pin.OUT)\ngreen = Pin(15, Pin.OUT)\nwhite = Pin(16, Pin.OUT)\nuart = UART(0, baudrate=9600)\nuart.init(9600, bits=8, parity=None, stop=1, tx=Pin(0), rx=Pin(1))\n\ndef flash(led):\n    led.on()\n    utime.sleep(0.25)\n    led.off()\n    utime.sleep(0.25)\n\ndef make_update_file(new_script):\n    with open(\"./update.py\", \"w\", encoding=\"utf-8\") as new:\n        print(\"making file\")\n        new
.writelines(new_script)\n        new.close()\n\ndef run_new():\n    try:\n        #print(\"new file found!\")\n        import update\n        update.main()\n    except:\n        #print(\"No update available\")\n        pass\n\ndef readCommand():\n    if uart.any() > 3:\n        message = uart.read()\n        update = True\n        uart.write(new_script)\n        return new_script\n    return\n        \n## Main loop ##\nfor i in range(0, 3):\n    flash(ind)        \n\nwhile True:\n    white.off()\n    green.on()\n    utime.sleep(1)\n    green.off()\n    utime.sleep(1)\n    try:\n        new_script = readCommand()\n        if update == True:\n            make_update_file(new_script)\n            break            \n    except:\n        pass\n        \n## New Loop ##\nuart.deinit()\nrun_new()"""

testList = test.split("\n")

with open("update.py", "w", encoding="utf-8") as file:
    for line in testList:
        file.write(line + "\n")
    file.close()
