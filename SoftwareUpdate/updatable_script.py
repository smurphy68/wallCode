import os
import time
import datetime

update = False
script = None
directory = r'\.'
dir_len = len(directory)

## For pico only
# def delete_oldest_update():
#     files = os.listdir(r'\.')
#     ctimes = [os.path.getctime(os.path.join(directory, file)) if "main.py" not in file and file != "__main__.py" for file in files]
#     dt_ctimes = [datetime.datetime.fromtimestamp(ctime) for ctime in ctimes]
#     oldest_dt = min(dt_ctimes)
#     oldest_index = dt_ctimes.index(oldest_dt)
#     oldest_file = files[oldest_index]

#     os.remove(os.path.join(directory, oldest_file))

def check_for_update():
    if "update.py" in os.listdir("./"):
        return True
    else: return False

def read_update(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        update = f.read()
        f.close()
        return update
    
def function():
    print("Hello world!")

while True:
    update = check_for_update()
    if update == False:
        function()
        time.sleep(3)
    else:
        try:
            script = read_update("update.py")
            os.rename("update.py", f"update{dir_len + 1}.py")
            dir_len += 1
            ## for pico only
            # if dir_len >= 6:
            #   delete_oldest_update()
            exec(script)
        except Exception as e:
            print(f"Function update failed: {str(e)}")