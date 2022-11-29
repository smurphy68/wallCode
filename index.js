// Database
const Datastore = require('nedb');

// Server
const express = require("express");

// Database init
const database = new Datastore("the_record.db");
database.loadDatabase();

// server init
const app = express();
const port = 5000;
app.listen(port, () => console.log(`Listening on port ${port}`))
app.use(express.static('public'))
app.use(express.json({
    limit: "1mb"
}))

// handles post request from the setting page. Getting it into the data base works
app.post("/db", (request, response) => {
    //console.log(request.body)
    route = request.body.holds.Holds
    details = request.body.details

    database.insert({
        route: route,
        routename: details.routename,
        setter: details.setter,
        grade: details.grade,
        attempts: details.attempts
    });
})


app.post("/sendRoute", (request, response) => {
    console.log(request.body);
    let search = request.body.search;
    database.find({routename: search}, (err, data) => {
        // -- this sucessfully retrieves a JSON object from the database
            // -- Ive tried both
        //let objecttoSend = data[0]
        let objecttoSend = JSON.stringify(data[0])
        
        // -- this sends a response but the browser thinks the response is empty... 
            //  == Ive tried them all

        //response.json(objecttoSend)
        //response.json("Please...")
        //response.json(JSON.stringify(objecttoSend))
        //response.send(JSON.stringify(objecttoSend))
    })
})