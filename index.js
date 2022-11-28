const express = require("express");
const app = express();
const port = 5000;
app.listen(port, () => console.log(`Listening on port ${port}`))

app.use(express.static('public'))
app.use(express.json( {
    limit: "1mb"
}))

app.post("/db", (request, response) => {
    console.log(request.body)
})