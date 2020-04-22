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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/resources/html/map.html'));
});

app.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname + '/resources/html/registration.html'))
})

app.get('/login', (req, res) => {
    res.render('logindex.ejs')
})

app.get('/collect', (req, res) => {
    res.render('collectcoin.ejs')
})


const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`)).on("error", console.log);

module.export = server

