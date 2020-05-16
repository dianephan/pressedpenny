const express = require('express');
const session = require('express-session');
const mountRoutes = require('./routes/index');
const env = require('dotenv').config();
var bodyParser = require('body-parser');
const path = require('path');           //this helps the google maps api show up
const db = require('./db');

////////////for login session//////////
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();
var parseurl = require('parseurl')

//////////url parsing//////////
const http = require('http');
const url = require('url');
///////cookies for sessions////////
var cookieParser = require('cookie-parser');
//////////////////////////////

const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use(cookieParser());

mountRoutes(app)

app.use(session({
    secret: 'ssshhhhh',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
    saveUninitialized: false,
    resave: true //originally F but unsure
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/resources/html/map.html'));
});

//no use for admin page .. YET 
app.get('/admin',(req,res) => {
    if(req.session.email) {
        res.write(`<h1>Hello ${req.session.email} </h1><br>`);
        res.end('<a href='+'/logout'+'>Logout</a>');
    }
    else {
        res.write('<h1>Please login first.</h1>');
        res.end('<a href='+'/login'+'>Login</a>');
    }
});

app.use('/logout', async (req,res) => {
    console.log(objectUsersInfo.username + ' is ready to logout');    
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        //it will clear the userData cookie 
        res.clearCookie('userData'); 
        res.send('user logout successful'); 
    });
});

// redirects user to HTML form to enter their information 
app.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname + '/resources/html/registration.html'));
})

app.post('/register', async (req, res) => {
    const userid = req.body.userid
    const email = req.body.email
    const pass = req.body.password
    const myQuery = `SELECT insert_user('${userid}', '${email}', '${pass}')`
    await db.query(myQuery)
    console.log(userid, "has been sucessfully registered")
    res.send("Success boyo")
})

//JSON object to be added to cookie (GLOBAL VARIABLE) referenced throughout project  
let objectUsersInfo = {}

//first you /setUser via res.cookie, then you redirect the user to their personalized page 
app.get('/welcome', (req, res)=>{ 
    res.cookie("userData", JSON.stringify(objectUsersInfo)); 
    console.log("setting user ", objectUsersInfo, " = usersInfo")
    res.sendFile(path.join(__dirname + '/resources/html/usermap.html'));
    // res.end('<a href='+'/users/' + objectUsersInfo.id +'>View your collection</a>');       //to add a button later on?    
}); 

//Iterate users data from cookie (shows username, email, pw)  
app.get(
    '/getuser', (req, res)=>{ 
    res.send(req.cookies); 
}); 

app.get('/login', async (req, res) => {
    res.render('logindex.ejs')
})

////// USER LOGS IN TO SEE WHAT THEY HAVE AND WHAT THEY DONT HAVE \\\\\\
app.post('/loginsession', async (req, res) => {
    var o = {} //empty object
    key = 'loggeduser'; 
    o[key] = []; //empty array to push values into 
    req.session.email = req.body.email
    req.session.pass = req.body.password
    const queryUserData = `SELECT EXISTS (SELECT 1 FROM users WHERE email = '${req.session.email}' AND  pass = '${req.session.pass}')`
    const userExistenceInfo = await db.query(queryUserData)

    // parse user's information if they exist in the db and add info to session cookies 
    if (userExistenceInfo.rows[0].exists) {
        var htmlMessage = 'Hello:' + req.session.email + 'you successfully logged in';
        console.log("post received: %s %s", req.session.email, req.session.pass);
        // res.send(htmlMessage)
        const userIDQuery  = `SELECT * FROM users WHERE email = '${req.session.email}' AND  pass = '${req.session.pass}'`       //for the logged in user's info
        const userIDResult = await db.query(userIDQuery)
        const currentUserID = userIDResult.rows[0].id
        const currentUsername = userIDResult.rows[0].user_name
        req.session.currentID = currentUserID
        req.session.username = currentUsername
        objectUsersInfo = { 
            username : req.session.username, 
            id : req.session.currentID
        };     
        o[key].push(objectUsersInfo);
        JSON.stringify(o);     
        //now write all the user data into the global cookie (formerly /setUser instead of /welcome)
        res.writeHead(301,{Location: 'http://localhost:3000/welcome'});   
        res.end();     
    } else {
        res.send("Login not successful")
    }
})


//please ignonre /collect and /coininsert. it may or may not be used in the final project 
app.get('/collect', (req, res) => {
    res.render('collectcoin.ejs')
})
app.post('/coininsert', async (req, res) => {
    const machine = req.body.machine
    const coin = req.body.coin
    const email = req.body.email

    const idQuery  = `SELECT * FROM users WHERE email = '${email}'`       //for the logged in user's info
    const idResult = await db.query(idQuery)
    const currentID = idResult.rows[0].id

    const machineQuery = `SELECT * FROM coins LEFT JOIN machines ON machines.id = coins.fk_machine_id LEFT JOIN locations ON locations.fk_machine_id = machines.id WHERE machinename = '${machine}'`
    const machineResult = await db.query(machineQuery)
    const machineID = machineResult.rows[0].fk_machine_id
    console.log(machineID, "is the machineid")
    const coinQuery = `SELECT * FROM coins WHERE fk_machine_id = '${machineID}' AND coinname = '${coin}'`
    const coinResult = await db.query(coinQuery)
    const coinID = coinResult.rows[0].id
    console.log(coinID, "is the coinid for ", coin)

    // const myQuery = `SELECT insert_coin_entry('${userid}', '${email}', '${pass}');`
    //// (fk_user INT, fk_coins INT, input_year INT) 
    var htmlData = 'Hello:' + email + ' u want to insert' + coin + 'to' + machine;
    res.send(htmlData)
})

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`)).on("error", console.log);

module.export = server
