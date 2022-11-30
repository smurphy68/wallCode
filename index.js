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
    // In JS you should always declare let or const for variables
    // the reason this worked before was because functions are really objects under the hood but shhhh
    const route = request.body.holds.Holds
    const details = request.body.details
    // above could be written like 
    // const {
    //   holds: { Holds: route },
    //   details,
    // } = request.body;

    database.insert({
      route: route,
      routename: details.routename,
      setter: details.setter,
      grade: details.grade,
      attempts: details.attempts
    },
    (error, newData) => {
        if (error) {
            return response.status(500).json(error)
        }

        return response.send('route saved')
    });
})


app.post("/sendRoute", (request, response) => {
    console.log(request.body);
    let search = request.body.search;
    database.find({routename: search}, (err, data) => {
        // -- this sucessfully retrieves a JSON object from the database
            // -- Ive tried both
        //let objecttoSend = data[0]
        // let objecttoSend = JSON.stringify(data[0])
        
        // -- this sends a response but the browser thinks the response is empty... 
            //  == Ive tried them all

        //response.json(objecttoSend)
        //response.json("Please...")
        //response.json(JSON.stringify(objecttoSend))
        //response.send(JSON.stringify(objecttoSend))

        if (error) {
            // 500 = generic server error
            return response.status(500).send(error)
        }
        // if you want all the data
        return response.json(data[0])
    })
})

// GET for asking for data from the server
// POST is for saving new data

// I'd suggest something like this 
// GET http://localhost:5000/routes?search=INSERT_ROUTE_NAME
// To get one route
// GET http://localhost:5000/routes
// To get all routes in db
app.get('/routes', (request, response) => {
    const searchTerm = request.query.search

    if (searchTerm) {
        dbQuery.routename = searchTerm
    }
    // L87 - L90 can be written like const dbQuery = {...searchTerm && {routename: searchTerm}} if you wanna be fancy
    database.find(dbQuery, (error, data) => {
        if (error) {
            return response.status(500).send(error)
        }

        return response.json({ routes: data })
    })
})