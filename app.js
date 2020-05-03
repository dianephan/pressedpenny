const express = require('express');
const session = require('express-session');
const mountRoutes = require('./routes/index');
const env = require('dotenv').config();
var bodyParser = require('body-parser');
const path = require('path');           //this helps the google maps api show up
const db = require('./db');

//for login session
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();
//////////////////////////////

const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies

mountRoutes(app)

app.use(session({
    secret: 'ssshhhhh',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
    saveUninitialized: false,
    resave: false
}));

// const router = express.Router();     //no idea what this does 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/resources/html/map.html'));
});

app.get('/admin',(req,res) => {
    if(req.session.email) {
        res.write(`<h1>Hello ${req.session.email} </h1><br>`);
        res.end('<a href='+'/logout'+'>Logout</a>');
    }
    else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href='+'/'+'>Login</a>');
    }
});

app.get('/logout',(req,res) => {
    res.write(`<h1>Hello ${req.session.email} u tryna log out? </h1><br>`);
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        console.log(`${req.session.email}  tryna log out`)
        res.end('<a href='+'/logout'+'>Logout</a>');
    });
});

app.get('/registration', (req, res) => {
    // const email = req.body.email
    // const pass = req.body.password
    // console.log("registering user: %s %s", email, pass);
    res.sendFile(path.join(__dirname + '/resources/html/registration.html'))
})

app.post('/register', (req, res) => {
    //reaches success but not inserted into db yet 
    res.send("Successful registration  dawg")
})

app.get('/login', (req, res) => {
    const email = req.body.email
    const pass = req.body.password
    const myQuery = `SELECT EXISTS (SELECT 1 FROM users WHERE email = '${email}' AND  pass = '${pass}')`
    const result = await db.query(myQuery)
    console.log("post received: %s %s", email, pass);
    console.log(result.rows[0].exists)
    
    if (result.rows[0].exists) {
        res.send("Successful login.")
        // res.sendFile(path.join(__dirname + '/../resources/html/map.html'));
    } else {
        res.send("not scucessful")
    }
})

app.post('/loginsession', (req, res) => {
    res.send("Successful login ini loginsession")
})



app.get('/collect', (req, res) => {
    res.render('collectcoin.ejs')
})


const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`)).on("error", console.log);

module.export = server


