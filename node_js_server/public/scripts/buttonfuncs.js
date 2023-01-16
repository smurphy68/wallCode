// SETUP

// Maximum size of bytes array.
const HEADER = 5000;
// Pic Server Port.
const PORT = 5050;
// Pico Server Address.
const SERVER = "192.168.1.72";

// Containers 
let buttons = Array.from(document.getElementsByClassName('button'));
let Holds = [];
let HoldsDict = {}
let initialArray = [];
let currentlySelectedRoute = []

// DISPLAYING THE SELECTED ROUTE ON THE BOARD

// Send the value of msg to the pico server
function sendRoute(msg) {
    // Define fetch method options for send route function.
    let sendRouteOptions = {
        method: "POST",
        headers: {
            'content-type': 'application/json', 'accept': 'application/json'
        },
        mode: 'no-cors',
        body: JSON.stringify(msg)
    };
    // POST route holds.
    fetch(`http://${SERVER}:${PORT}`, sendRouteOptions)
        .then(jsonResponse => { console.log(jsonResponse) })
        .catch((err) => console.log(err));
}

// Define the Hold class
class Hold {
    // Contructor takes a string HoldID.
    constructor(holdID, colour = "", state = "off") {
        // Variables to store name, state of hold and colour of hold.
        this.holdID = holdID;
        this.state = state;
        this.colour = colour;
    };

    // Change state method toggles colour of target hold element on click --> off, start, route, foot, end.
    changeState() {
        switch (this.state) {
            case (this.state = "off"):
                this.state = "start";
                this.colour = "green";
                break;
            case (this.state = "start"):
                this.state = "route";
                this.colour = "blue";
                break;
            case (this.state = "route"):
                this.state = "foot";
                this.colour = "aqua";
                break;
            case (this.state = "foot"):
                this.state = "end";
                this.colour = "red";
                break;
            case (this.state = "end"):
                this.state = "off";
                this.colour = "";
                break;
        };
    };
    // If the hold is refreshed, reset to default
    refreshHolds() {
        this.state = "off";
        this.colour = "";
    };
};

for (let i = 0; i < buttons.length; i++) {
    Holds[i] = new Hold(buttons[i].innerHTML);
};

for (let i = 0; i < buttons.length; i++) {
    let label = Holds[i].holdID
    HoldsDict[label] = Holds[i]
}

for (let i = 0; i < buttons.length; i++) {
    initialArray[i] = new Hold(buttons[i].innerHTML, state = "_");
};

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        let hold = HoldsDict[e.target.innerHTML];
        hold.changeState();
        button.style.backgroundColor = hold.colour;
        button.style.opacity = 0.5;
    });
});

let resetButton = document.getElementById("reset");
// add event listener to target reset button which resets the holds on the client, the holds stored in the arrays and the board.
resetButton.addEventListener('click', (e) => {
    // loop through each hold and reset all hold objects
    for (const [key, value] of Object.entries(Holds)) {
        value.refreshHolds();
    };
    // reset all hold objecs stored in Holds
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.backgroundColor = "";
        buttons[i].style.opacity = 1.0;
    };
    // reset all holds stored in the comparison array
    for (const [key, value] of Object.entries(initialArray)) {
        value.refreshHolds();
    };
    // send reset command to the pico-W socket
    sendRoute("reset");
})

let displayButton = document.getElementById("submit");
// add event listener to dislay button element which condenses the changes on the board into a string, which is then sent to the pico-W socket.
displayButton.addEventListener('click', (e) => {
    // declare message to send
    let message = "";
    // loop through the current hold states and append those hold, state pairs to a string if they differ from what is currently on the board.
    for (let i = 0; i < Object.values(Holds).length; i++) {
        if (Object.values(Holds)[i].state !== Object.values(initialArray)[i].state) {
            message = message += `${Object.values(Holds)[i].holdID.toLowerCase().replace(/\s/g, '')} ${Object.values(Holds)[i].state}, `;
            Object.values(initialArray)[i].state = Object.values(Holds)[i].state;
        };
    };
    // trim the trailing " ," characters
    message = message.substring(0, message.length - 2);
    // send the route to the pico-W socket
    sendRoute(message);
});

// ADDING CURRENT ROUTE TO THE DATABASE

let uploadButton = document.getElementById("upload");
// uploadButton with add the 
uploadButton.addEventListener('click', (e) => {
    e.preventDefault();
    upload();
});

// upload currently set route to the database
function upload() {
    options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            holds: { Holds },
            details: {
                routename: document.getElementById("routeform")[0].value,
                setter: document.getElementById("routeform")[1].value,
                grade: document.getElementById("routeform")[2].value,
                attempts: document.getElementById("routeform")[3].value,
            },
            mode: 'no-cors',
        })
    };
    // Send options to node server for processing
    fetch('/db', options)
    // alert user!
    alert("Route Added!")
};

// Function to show preview of route in browser
function displayRoute(route) {
  route.forEach((hold) => {
    if (!hold.holdID) {
      return;
    }
    const holdElement = document.getElementById(hold.holdID);
    holdElement.style.backgroundColor = hold.colour;
    holdElement.style.opacity = 0.5;
  });
}

// 
function getData(search = "") {
  fetch(`/routes?search=${search}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const tableContainer = document.getElementById("table");
      data.routes.forEach((routeData) => {
        const elementContainer = document.createElement("button");
        const detailsContainer = document.createElement("div");
        const routeName = document.createElement("h2");
        const setter = document.createElement("span");
        const grade = document.createElement("span");

        routeName.innerText = routeData.routename;
        setter.innerText = routeData.setter;
        grade.innerText = routeData.grade;

        detailsContainer.appendChild(setter);
        detailsContainer.appendChild(grade);
        detailsContainer.className = "d-flex space-between";

        elementContainer.appendChild(routeName);
        elementContainer.appendChild(detailsContainer);
        elementContainer.className = "list-item";

        elementContainer.onclick = () => displayRoute(routeData.route);
      });
    });
}

// First call of getData() startup, with default search term "" to bring up all avaliable routes.
getData()

