// Google said it should be asynchronous. Im only loosley aware of what that means
//async function getData(search=null) {
//    options = {
//        method: "POST",
//        headers: {
//            "Content-Type": "application/json"
//        },
//        body: JSON.stringify({search})
//    };

//    await fetch('/sendRoute', options).then((response) => {
//        console.log(response)
//    })
//};

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

//Test call to get array in browser
getData();
