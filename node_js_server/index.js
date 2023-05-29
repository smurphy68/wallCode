// Database
const Datastore = require('nedb');

// Server
const express = require("express");

const app = express();
const port = 5000;

// server init
try {
    app.listen(port, () => console.log(`Listening on port: http://localhost:${port}`))
    app.use(express.static('public'));
    app.use(express.json({
        limit: "1mb"
    }))

    console.log("Server loaded with no errors.")
} catch (e) {
    console.log(e);
}

// Database init
const database = new Datastore("the_record.db");
database.loadDatabase();

// handles request from the setting page
app.post("/db", (request, response) => {
    console.log("request recieved");
    const route = request.body.holds.Holds
    const details = request.body.details
// insert posted route into the database file, with callback function to the client if there is an error
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

// search database for a route using a search term from the client and return the response
app.get('/routes', (request, response) => {
    console.log("request recieved");
    const searchTerm = request.query.search
    const searchRegex = new RegExp(searchTerm, "i")
    const dbQuery = { ...searchTerm && { routename: { $regex: searchRegex } } }
    database.find(dbQuery, (error, data) => {
        if (error) {
            return response.status(500).send(error)
        }
        return response.json({ routes: data })
    })
})