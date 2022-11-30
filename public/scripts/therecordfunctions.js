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

function getData(search="") {
            fetch(`/routes?search=${search}`).then((response) => {
            return response.json()
        }).then((data) => {
            console.log(data)
        })
    }


//Test call to get array in browser
getData()