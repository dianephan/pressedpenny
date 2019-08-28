// get method is a HTTP method
const express = require('express');
const mountRoutes = require('./routes/index');
const env = require('dotenv').config();
var bodyParser = require('body-parser');
const path = require('path');           //this helps the google maps api show up

const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies

mountRoutes(app)


// const router = express.Router();     //no idea what this does 

// for the css folder 
// app.use(express.static('../library'))

const users = []

app.get('users', (req, res) => {
    res.json(users)
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/resources/html/map.html'));
});

app.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname + '/resources/html/registration.html'))
})

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));

module.export = server