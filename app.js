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

// this works but its  not the right login page i want 
app.get('/login', (req, res) => {
    // res.render('logindex.ejs')
})

app.get('users', (req, res) => {
    res.json(users)
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/resources/html/map.html'));
});

//no longer need thte ejs file i think 
app.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname + '/resources/html/registration.html'))
})

app.post('/register', (req, res) => {
    res.send('henlofdsagjlkjdslkaf ')
})


const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`)).on("error", console.log);

module.export = server