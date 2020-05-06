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
        res.end('<a href='+'/login'+'>Login</a>');
    }
});

app.use('/logout', async (req,res) => {
    console.log("yo u trying to log out ", usersInfo.username);    
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        // res.write(` '<h1>bye ' + ' ${req.session.email} ' </h1><br>'`);
        //it will clear the userData cookie 
        res.clearCookie('userData'); 
        res.send('user logout successfully'); 
        // res.end('<a href = '+'/bye'+'>Logout</a>');
    });
});

app.get('/bye',(req,res) => {
    req.session.email = req.body.email
    console.log("peace out", req.session.email);    
    res.send("you have peaced out");
    // res.write(`<h1> you have peaced out </h1><br>`);
});

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

//trying a node tutorial 

http.createServer(function (req, res) {
    const queryObject = url.parse(req.url,true).query;
    console.log(queryObject);
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Feel free to add query parameters to the end of the url');
  }).listen(5000);

//following g4g 
//JSON object to be added to cookie (GLOBAL VARIABLE)  
let usersInfo = {}

//first you set, then you get data 

//route for adding cookie 
app.get('/setuser', (req, res)=>{ 
    res.cookie("userData", usersInfo); 
    res.send('user data added to cookie'); 
    console.log(usersInfo, " = usersInfo")
}); 

//Iterate users data from cookie 
app.get('/getuser', (req, res)=>{ 
    //shows all the cookies 
    res.send(req.cookies); 
}); 

app.get('/login', async (req, res) => {
    // var sessionData = req.session;   //dont remember what this is
    //should i combine logindex with their personalized map 
    res.render('logindex.ejs')
})

////// USER LOGS IN TO SEE WHAT THEY HAVE AND WHAT THEY DONT HAVE \\\\\\
app.post('/loginsession', async (req, res) => {
    var o = {} //empty object
    key = 'loggeduser'; 
    o[key] = []; //empty array to push values into 

    req.session.email = req.body.email
    req.session.pass = req.body.password
    
    const myQuery = `SELECT EXISTS (SELECT 1 FROM users WHERE email = '${req.session.email}' AND  pass = '${req.session.pass}')`
    const idQuery  = `SELECT * FROM users WHERE email = '${req.session.email}' AND  pass = '${req.session.pass}'`       //for the logged in user's info
    const result = await db.query(myQuery)
    const idResult = await db.query(idQuery)
    const currentID = idResult.rows[0].id
    const username = idResult.rows[0].userid
    
    req.session.currentID = currentID
    req.session.username = username
    
    usersInfo = { 
        username : req.session.username, 
        id : req.session.currentID
    };     
    o[key].push(usersInfo);
    JSON.stringify(o); 
    console.log(o);

    if (result.rows[0].exists) {
        var htmlData = 'Hello:' + req.session.email + ' u successfully logged in';
        console.log("post received: %s %s", req.session.email, req.session.pass);
        // res.send(htmlData)

        res.sendFile(path.join(__dirname + '/resources/html/usermap.html'), {username : username});
        // TO DO : NEED TO REDIRECT TO PERSONALIZED HTML PAGE 
        // res.render('collectcoin.ejs')
    } else {
        res.send("not scucessful")
    }


})

//getting usermap
app.get('/usermap', (req, res) => {
    res.sendFile(path.join(__dirname + '/resources/html/usermap.html'));
})

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
