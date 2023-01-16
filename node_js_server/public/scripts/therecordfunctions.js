// SETUP
// disables selection of another route whilst route is being fetched to avoid errors.
let disableButton = false

// Declare the current array displayed on the API, for altering later on
let currentlySelectedRoute = Array(49).fill("").map((_item, index) => {
  return {
    holdID: `Hold ${index + 1}`,
    state: "off",
    colour: ""
  };
});

// "THE RECORD" FUNCTIONS

// Generate the route message to send to the board, by comparing each hold in the current and new arrays.
function genRouteMessage(oldRoute, newRoute) {
  const updates = newRoute.filter((hold, index) => {
    return hold.state !== oldRoute[index].state
  })
  return updates.map((hold) => {
    return `${hold.holdID.toLowerCase().split(' ').join('')} ${hold.state}`
  }).join(", ")
}

// Display the currently selected route on the API
function displayRoute(route) {
  if (disableButton) return
  route.forEach((hold) => {
    if (!hold.holdID) {
      return;
    }
    const holdElement = document.getElementById(hold.holdID);
    holdElement.style.backgroundColor = hold.colour;
    holdElement.style.opacity = 0.5;
  });
  const message = genRouteMessage(currentlySelectedRoute, route)

  // This would normally send the route to the board but causes a timeout error without being connected to the wall
  // sendRoute(message)

  // replace the currently selected route that is being displayed.
  currentlySelectedRoute = route
}

// function to send the route to the board, only one route can be sent at a time to the board.
function sendRoute(msg) {
  sendRouteOptions = {
    method: "POST",
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json'
    },
    mode: 'no-cors',
    body: JSON.stringify(msg)
  };
  // whilst disable button is true, another request cannot be made, returned to false once either process is complete.
  disableButton = true;
  fetch('http://192.168.1.72:5050', sendRouteOptions)
    .then(jsonResponse => { 
      disableButton = false;
    })
    .catch((err) => {
      console.log(err);
      disableButton = false;
    });
}

// Reset board to all "off" as page loads.
// sendRoute("reset")

// Retrieve the available routes from the database. The first call automatically populates the window with a list of all of the routes
function getData(search = "") {
  const tableContainer = document.getElementById("listofroutes");
  tableContainer.innerHTML = "";
  fetch(`/routes?search=${search}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
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
};

// add event listener and call getData() using the search term
const searchButton = document.getElementById("searchforroute")
.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = document.getElementById("searchterm").value;
  getData(searchTerm);
})
