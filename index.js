const Datastore = require('nedb');
const express = require("express");

const database = new Datastore("the_record.db");
database.loadDatabase();

const app = express();
const port = 5000;
app.listen(port, () => console.log(`Listening on port ${port}`))
app.use(express.static('public'))
app.use(express.json({
    limit: "1mb"
}))

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

app.post("/lr", (request, response) => {
    console.log(request.body);
    let search = request.body.search;
    database.find({routename: search}, (err, data) => {
        //send response
        response.body = JSON.stringify(data);
        response.json()
    })
})