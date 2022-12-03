let disableButton = false

let currentlySelectedRoute = Array(49).fill("").map((_item, index) => {
  return {
    holdID: `Hold ${index + 1}`,
    state: "off",
    colour: ""
  };
});

function genRouteMessage(oldRoute, newRoute) {
  const updates = newRoute.filter((hold, index) => {
    return hold.state !== oldRoute[index].state
  })
  return updates.map((hold) => {
    return `${hold.holdID} ${hold.state}`
  }).join(", ")
}

function displayRoute(route) {
  if (disableButton) return
  console.log("YOU DID PASS")
  route.forEach((hold) => {
    if (!hold.holdID) {
      return;
    }
    const holdElement = document.getElementById(hold.holdID);
    holdElement.style.backgroundColor = hold.colour;
    holdElement.style.opacity = 0.5;
  });

  const message = genRouteMessage(currentlySelectedRoute, route)
  sendRoute(message)
  currentlySelectedRoute = route
}

function sendRoute(msg) {
  // define fetch method options for send route function.
  sendRouteOptions = {
    method: "POST",
    headers: {
      'content-type': 'application/json',
      'accept': 'application/json'
    },
    mode: 'no-cors',
    body: JSON.stringify(msg)
  };
  disableButton = true
  // POST route holds.
  fetch('http://192.168.1.72:5050', sendRouteOptions)
    .then(jsonResponse => { 
      console.log(jsonResponse) 
      disableButton = false
    })
    .catch((err) => {
      console.log(err)
      disableButton = false
    });
}

// Reset board to all off as page loads.
sendRoute("reset")

function getData(search = "") {
  const tableContainer = document.getElementById("listofroutes");
  tableContainer.innerHTML = ""
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
}

//Test call to get array in browser
getData();

const searchButton = document.getElementById("byu")
.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = document.getElementById("searchterm").value
  getData(searchTerm)
})
