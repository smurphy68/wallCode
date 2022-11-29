async function getData(search=null) {
    options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({search})
    };

    await fetch('/lr', options).then((response) => {
        res = response.body
        console.log(JSON.stringify(res))
    })
};

getData("Test")