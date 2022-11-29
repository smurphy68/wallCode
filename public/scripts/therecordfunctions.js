// Google said it should be asynchronous. Im only loosley aware of what that means
async function getData(search=null) {
    options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({search})
    };

    await fetch('/sendRoute', options).then((response) => {
        console.log(response)
    })
};

//Test call to get array in browser
getData("Test")