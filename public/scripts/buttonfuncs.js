let buttons = Array.from(document.getElementsByClassName('button'));

// Maximum size of bytes array.
HEADER = 5000;
// Pic Server Port.
PORT = 5050;
// Pico Server Address.
SERVER = "192.168.1.72";

function sendRoute(msg) {
    // define fetch method options for send route function.
    sendRouteOptions = {
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

class Hold {
    // Contructor takes a string HoldID.
    constructor(holdID, colour = "", state = "off") {
        this.holdID = holdID;
        this.state = state;
        this.colour = colour;
    };

    // Change state method changes colour of CSS box on click.
    changeState() {
        switch (this.state) {
            case (this.state = "off"):
                this.state = "start";
                this.colour = "green";
                //console.log(`[NEW STATE]: ${this.holdID} is a ${this.state} hold.`);
                break;
            case (this.state = "start"):
                this.state = "route";
                this.colour = "blue";
                //console.log(`[NEW STATE]: ${this.holdID} is a ${this.state} hold.`);
                break;
            case (this.state = "route"):
                this.state = "foot";
                this.colour = "aqua";
                //console.log(`[NEW STATE]: ${this.holdID} is a ${this.state} hold.`);
                break;
            case (this.state = "foot"):
                this.state = "end";
                this.colour = "red";
                //console.log(`[NEW STATE]: ${this.holdID} is a ${this.state} hold.`);
                break;
            case (this.state = "end"):
                this.state = "off";
                this.colour = "";
                //console.log(`[NEW STATE]: ${this.holdID} is ${this.state}.`);
                break;
        };
    };

    refreshHolds() {
        this.state = "off";
        this.colour = "";
    };
};

let Holds = [];
let HoldsDict = {}
let initialArray = [];

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
resetButton.addEventListener('click', (e) => {
    console.log("[RESET]: Reset button clicked.");
    for (const [key, value] of Object.entries(Holds)) {
        value.refreshHolds();
    }
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.backgroundColor = "";
        buttons[i].style.opacity = 1.0;
    }
    for (const [key, value] of Object.entries(initialArray)) {
        value.refreshHolds();
    }
    sendRoute("reset");
})

let displayButton = document.getElementById("submit");
displayButton.addEventListener('click', (e) => {
    let message = "";
    for (let i = 0; i < Object.values(Holds).length; i++) {
        if (Object.values(Holds)[i].state !== Object.values(initialArray)[i].state) {
            message = message += `${Object.values(Holds)[i].holdID.toLowerCase().replace(/\s/g, '')} ${Object.values(Holds)[i].state}, `;
            Object.values(initialArray)[i].state = Object.values(Holds)[i].state;
        };
    };
    message = message.substring(0, message.length - 2);
    sendRoute(message);
});

let uploadButton = document.getElementById("upload");
uploadButton.addEventListener('click', (e) => {
    e.preventDefault();
    console.log("[UPLOAD] Route posted to Database.");
    upload();
});

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

    fetch('/db', options)
    alert("Route Added!")
};

let currentlySelectedRoute = []

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

function sendRout() {

}

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

        tableContainer.appendChild(elementContainer);
      });
    });
}

getData()

