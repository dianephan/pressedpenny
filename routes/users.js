const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()
const path = require('path');           //this helps the google maps api show up
var session = require('express-session')
const express = require('express');
var bodyParser = require('body-parser');
const mountRoutes = require('./index');

//////////for login session//////////
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();
var parseurl = require('parseurl')
//////////url parsing//////////
const http = require('http');
const url = require('url');
var cookieParser = require('cookie-parser');            // for user sessions
//this part is necessary for posting the user's email and pw 
router.use(bodyParser.json());                          // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
router.use(cookieParser());

router.use(session({
    secret: 'ssshhhhh',
    // create new redis store.
    store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
    saveUninitialized: false,
    resave: true //originally F but unsure
}));

// /////////////////////////////////
//         FOR FRONTEND
// /////////////////////////////////

router.use('/logout', async (req,res) => {
    console.log('[INFO] : ' + objectUsersInfo.username + ' requested to logout');    
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.clearCookie('userData'); 
        res.send('User successfully logged out.'); 
    });
});

// redirects user to HTML form to enter their information 
router.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname, '../resources/html', 'registration.html'));
})

router.post('/register', async (req, res) => {
    const userid = req.body.userid
    const email = req.body.email
    const pass = req.body.password
    const myQuery = `SELECT insert_user('${userid}', '${email}', '${pass}')`
    await db.query(myQuery)
    console.log("[INFO] : ", userid, "has been sucessfully registered")
    res.send("Registered successfully!")
})

//JSON object to be added to cookie (GLOBAL VARIABLE) referenced throughout project  
let objectUsersInfo = {}

//first you /setUser via res.cookie, then you redirect the user to their personalized page 
router.get('/welcome', (req, res)=>{ 
    res.cookie("userData", JSON.stringify(objectUsersInfo)); 
    console.log("[INFO] : setting user ", objectUsersInfo, " = usersInfo")
    res.sendFile(path.join(__dirname, '../resources/html', 'usermap.html'));
    // res.end('<a href='+'/users/' + objectUsersInfo.id +'>View your collection</a>');       //to add a button later on?    
}); 

//Iterate users data from cookie (shows username, email, pw)  
router.get('/getuser', (req, res)=>{ 
    res.send(req.cookies); 
}); 

router.get('/login', async (req, res) => {
    // res.render('logindex.ejs')
    res.sendFile(path.join(__dirname, '../resources/html', 'logindex.html'));
})

////// USER LOGS IN TO SEE WHAT THEY HAVE AND WHAT THEY DONT HAVE \\\\\\
router.post('/loginsession', async (req, res) => {
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
        console.log("[INFO] : post received: %s %s", req.session.email, req.session.pass);
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
        res.writeHead(301,{Location: 'http://localhost:3000/users/welcome'});   
        res.end();     
    } else {
        res.send("Login not successful")
    }
})



//please ignonre /collect and /coininsert. it may or may not be used in the final project 
router.get('/collect', (req, res) => {
    res.sendFile(path.join(__dirname, '../resources/html', 'collectcoin.html'));
})

router.post('/coininsert', async (req, res) => {
    const machine = req.body.machine
    const coin = req.body.coin
    const email = req.body.email

    const idQuery  = `SELECT * FROM users WHERE email = '${email}'`       //for the logged in user's info
    const idResult = await db.query(idQuery)
    const currentID = idResult.rows[0].id

    const machineQuery = `SELECT * FROM coins LEFT JOIN machines ON machines.id = coins.fk_machine_id LEFT JOIN locations ON locations.fk_machine_id = machines.id WHERE machinename = '${machine}'`
    const machineResult = await db.query(machineQuery)
    const machineID = machineResult.rows[0].fk_machine_id
    console.log("[INFO] : ", machineID, "is the machineid")
    const coinQuery = `SELECT * FROM coins WHERE fk_machine_id = '${machineID}' AND coinname = '${coin}'`
    const coinResult = await db.query(coinQuery)
    const coinID = coinResult.rows[0].id
    console.log("[INFO] : " , coinID, "is the coinid for ", coin)

    // const myQuery = `SELECT insert_coin_entry('${userid}', '${email}', '${pass}');`
    //// (fk_user INT, fk_coins INT, input_year INT) 
    var htmlData = 'Hello:' + email + ' u want to insert' + coin + 'to' + machine;
    res.send(htmlData)
})

///////////////////////////////////
        // FOR DATABASE
///////////////////////////////////

//delete once project is done lool 
router.get('/all', async (req, res) => {
    const { rows } = await db.query("SELECT * FROM users; ")
    res.send(rows)
})
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const { rows } = await db.query(`SELECT * FROM get_user_map_data(${id})`);
    res.send(rows)
})

module.exports = router

