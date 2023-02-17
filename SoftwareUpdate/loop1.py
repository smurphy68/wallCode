import os
import time

update = False

def check_for_update():
    if "update.py" in os.listdir("./"):
        return False
    else: return True

def read_update(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        update = f.read()
        f.close()
        return update
    

def loop_forever():
    print("Hello world!")

while True:
    update = check_for_update()
    if update == False:
        loop_forever()
        time.sleep(3)
    else:
        try:
            update = read_update("update.py")
            exec(update, globals())
            loop_forever = globals()["update"]
            dir_len = len(os.listdir(r'\.'))
            os.rename("update.py", f"update{dir_len}.py")
        except Exception as e:
            print(f"Function update failed: {str(e)}")