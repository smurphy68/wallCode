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
    const route = request.body.holds.Holds
    const details = request.body.details

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

app.get('/routes', (request, response) => {
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