let buttons = Array.from(document.getElementsByClassName('button'));

//formatting parameters for sending messages through socket
HEADER = 3000
PORT = 5050
DISCONNECT_MESSAGE = "!DISCONNECT"
SERVER = "192.168.1.72"

function sendRoute(msg) {
    fetch(`http://${SERVER}:${PORT}`, {
        method: "POST",
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        mode: 'no-cors',
        body: JSON.stringify(msg)
    })
        .then(jsonResponse => {
            console.log(jsonResponse)
        })
        .catch((err) => console.log(err));
}

class Hold {
    constructor(holdID, colour = "", state = "off") {
        this.holdID = holdID;
        this.state = state;
        this.colour = colour
    }


    //to discuss, throws an error, I assume we have to define the list of possible states? I dont understand the lower syntax :D
    newChangeState() {
        const newStateStateIndex = this.possibleStates.findIndex((item) => item === this.state) + 1;
        this.state = newStateStateIndex < this.possibleStates.length
            ? this.possibleStates[newStateStateIndex]
            : this.possibleStates[0];
    }

    changeState() {
        switch (this.state) {
            case (this.state = "off"):
                this.state = "start";
                this.colour = "green"
                console.log(`[NEW STATE]: ${this.holdID} is a ${this.state} hold.`);
                break
            case (this.state = "start"):
                this.state = "route";
                this.colour = "blue"
                console.log(`[NEW STATE]: ${this.holdID} is a ${this.state} hold.`);
                break
            case (this.state = "route"):
                this.state = "foot";
                this.colour = "aqua"
                console.log(`[NEW STATE]: ${this.holdID} is a ${this.state} hold.`);
                break
            case (this.state = "foot"):
                this.state = "end";
                this.colour = "red"
                console.log(`[NEW STATE]: ${this.holdID} is a ${this.state} hold.`);
                break
            case (this.state = "end"):
                this.state = "off";
                this.colour = ""
                console.log(`[NEW STATE]: ${this.holdID} is ${this.state}.`);
                break
        }
    }

    refreshHolds() {
        this.state = "off"
        this.colour = ""
    }
}

var Holds = []
let initialArray = []

for (let i = 0; i < buttons.length; i++) {
    Holds[buttons[i].innerHTML] = new Hold(buttons[i].innerHTML);
}

for (let i = 0; i < buttons.length; i++) {
    initialArray[buttons[i].innerHTML] = new Hold(buttons[i].innerHTML, state = "_");
}

buttons.map(button => {
    button.addEventListener('click', (e) => {
        let hold = Holds[e.target.innerHTML];
        hold.changeState();
        button.style.backgroundColor = hold.colour;
        button.style.opacity = 0.5;
    })
})

let resetButton = document.getElementById("reset");
resetButton.addEventListener('click', (e) => {
    console.log("[RESET]: Reset button clicked.")
    for (const [key, value] of Object.entries(Holds)) {
        value.refreshHolds()
    }
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.backgroundColor = "";
        buttons[i].style.opacity = 1.0;
    }
    for (const [key, value] of Object.entries(initialArray)) {
        value.refreshHolds()
    }
    sendRoute("reset")
})

let displayButton = document.getElementById("submit");
displayButton.addEventListener('click', (e) => {
    let message = ""
    for (let i = 0; i < Object.values(Holds).length; i++) {
        if (Object.values(Holds)[i].state !== Object.values(initialArray)[i].state) {
            message = message += `${Object.values(Holds)[i].holdID.toLowerCase().replace(/\s/g, '')} ${Object.values(Holds)[i].state}, `;
            Object.values(initialArray)[i].state = Object.values(Holds)[i].state
        }
    }
    //console.log("altered array:", Holds)
    message = message.substring(0, message.length - 2)
    sendRoute(message)
})

let uploadButton = document.getElementById("upload");
uploadButton.addEventListener('click', (e) => {
    e.preventDefault()
    console.log("[UPLOAD] Route posted to Database.");
    upload()
})

function upload() {
    dbHolds = []
    for (let i=0; i<42; i++) {
        hold = Holds[`Hold ${i}`]
        // state = hold["state"]
        // dbHolds.push([hold, state])
        dbHolds.push(hold)
    }

    options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'Holds': {dbHolds},
            'Details': {
                routename: document.getElementById("routeform")[0].value,
                setter: document.getElementById("routeform")[1].value,
                grade: document.getElementById("routeform")[2].value,
                attempts: document.getElementById("routeform")[3].value,
            }
        })
    }

    toDB = fetch('/db', options)
}
