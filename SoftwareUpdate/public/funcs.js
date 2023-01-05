console.log("Loaded")
function sendMessage(msg) {
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

    fetch('http://192.168.1.83:5050', sendRouteOptions)
      .then(jsonResponse => { 
        console.log(jsonResponse) 
        disableButton = false
      })
      .catch((err) => {
        console.log(err)
        disableButton = false
      });
  }

const submitButton = document.getElementById("submitscript").addEventListener("click", (e) => {
  e.preventDefault()
  const script = document.getElementById("script").value
  sendMessage(script)
  console.log(script)
})