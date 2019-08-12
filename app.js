// get method is a HTTP method

var http = require('http');
const express = require('express'); 
const mountRoutes = require('./routes/index');
const env = require('dotenv').config(); 

const app = express(); 
mountRoutes(app)

const path = require('path');           //this helps the google maps api show up
// const router = express.Router();     //no idea what this does 

// for the css folder 
// app.use(express.static('../library'))

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/map.html'));
});



const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));       

module.export = server 


