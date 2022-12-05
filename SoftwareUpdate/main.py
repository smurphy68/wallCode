def check_update():
    check = input("Y or N")
    if check.lower() == "y":
        return True
    return False

def make_update_file():
    with open("./update.py", "w", encoding="utf-8") as new:
        print("making file")
        new.writelines("""        
import time

## Updated loop ##        
def main():
    while True:
        time.sleep(3)
        print('executing new code')
                
""")
        new.close()

def run_new():
    try:
        print("new file found!")
        import update
        update.main()
    except:
        print("No update available")


## Main loop ##

while True:
    if check_update() == False:
        print("Executing previous code")
    else:
        print("Loop broken")
        break

## New Loop ##

make_update_file()
run_new()
    
