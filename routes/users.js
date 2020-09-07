const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()
const path = require('path');                           //this helps the google maps api show up
var session = require('express-session')
const express = require('express');
var bodyParser = require('body-parser');
const mountRoutes = require('./index');
const bcrypt = require('bcrypt');

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
    const queryUserData = `SELECT EXISTS (SELECT 1 FROM users WHERE email = '${req.session.email}')`
    const userExistenceInfo = await db.query(queryUserData)
    if (userExistenceInfo.rows[0].exists === true) {
        res.send("Email already taken. Please try again.")
    } else {
        const saltRounds = 10;
        const hash = bcrypt.hashSync(pass, saltRounds);
        const myQuery = `SELECT insert_user('${userid}', '${email}', '${hash}')`
        await db.query(myQuery)
        console.log("[INFO] : ", userid, "has been sucessfully registered")
        res.send("Registered successfully!")
    }
})

//JSON object to be added to cookie (GLOBAL VARIABLE) referenced throughout project  
let objectUsersInfo = {}

//first you /setUser via res.cookie, then you redirect the user to their personalized page 
router.get('/welcome', (req, res)=>{ 
    res.cookie("userData", JSON.stringify(objectUsersInfo)); 
    console.log("[INFO] : setting user ", objectUsersInfo, " = objectUsersInfo")
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

    const queryUserData = `SELECT EXISTS (SELECT 1 FROM users WHERE email = '${req.session.email}')`
    const userExistenceInfo = await db.query(queryUserData)
    // if user email exist in the db then add info to session cookies 
    if (userExistenceInfo.rows[0].exists) {
        const queryUserHashData = `SELECT * FROM users WHERE email = '${req.session.email}'`
        const userHashInfo = await db.query(queryUserHashData)
        hash = userHashInfo.rows[0].hashed_pass
        // if userExistenceInfo == True, then compare the bcrypt stuff 
        if (bcrypt.compareSync(req.session.pass, hash)) {
            console.log("[INFO] : User typed a pw that matches up with the hashed value")
            // var htmlMessage = 'Hello:' + req.session.email + 'you successfully logged in';
            // res.send(htmlMessage)
            const userIDQuery  = `SELECT * FROM users WHERE email = '${req.session.email}'`       //for the logged in user's info
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
            console.log("[INFO] : bcrypt says false - the password entered is incorrect")
            res.send("Login not successful. Wrong password.")
        }
    } else {
        res.send("Login not successful. User does not exist")
    }
})

router.get('/collect/:userid/:coinid', async (req, res) => {
    const userid = req.params.userid;
    const coinid = req.params.coinid;
    const currentYear = 2019 
    const myQuery = `SELECT insert_coin_entry('${userid}', '${coinid}', '${currentYear}')`
    const { rows } = await db.query(myQuery)
    console.log("[INFO] : coin has been inserted into user")
})

///////////////////////////////////
        // VIEW DATABASE
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

