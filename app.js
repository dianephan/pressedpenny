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
    saveUninitialized: true,
    resave: true //originally F but unsure
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
    const email = req.body.email
    console.log("yo u trying to log out %s", email);
    // res.write(`<h1>Hello u tryna log out? </h1><br>`);
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.end('<a href='+'/bye'+'>Logout</a>');
    });
});


app.get('/bye',(req,res) => {
    res.send("you have peaced out");
    // res.write(`<h1> you have peaced out </h1><br>`);
});

app.get('/registration', (req, res) => {
    // const email = req.body.email
    // const pass = req.body.password
    // console.log("registering user: %s %s", email, pass);
    res.send("registration page here")
})

app.post('/register', (req, res) => {
    //reaches success but not inserted into db yet 
    res.send("Successful registration  dawg")
})

app.get('/login', async (req, res) => {
    // var sessionData = req.session;   //dont remember what this is
    const email = req.body.email
    const pass = req.body.password
    res.render('logindex.ejs')
})

app.post('/loginsession', async (req, res) => {
    const email = req.body.email
    const pass = req.body.password

    const myQuery = `SELECT EXISTS (SELECT 1 FROM users WHERE email = '${email}' AND  pass = '${pass}')`
    const result = await db.query(myQuery)
    // await db.query(myQuery)
    console.log(result.rows[0].exists)
    if (result.rows[0].exists) {
        var htmlData = 'Hello:' + email + ' u successfully logged in';
        console.log("post received: %s %s", email, pass);
        res.send(htmlData)
    } else {
        res.send("not scucessful")
    }
})



app.get('/collect', (req, res) => {
    res.render('collectcoin.ejs')
})


const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`)).on("error", console.log);

module.export = server


