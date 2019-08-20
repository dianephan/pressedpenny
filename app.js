// get method is a HTTP method

// idk if the following is necessary!!
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

var http = require('http');
const express = require('express'); 
const mountRoutes = require('./routes/index');
const env = require('dotenv').config();         //scared this will mess everything up
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const app = express(); 
app.use(express.json());
const bcrpyt = require('bcrypt')

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),  // find user based on the email 
    id => users.find(user => user.id === id)            // check if user ID exists
    )



app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,        //idk if this is a good idea!
    resave: false,
    saveUninitialized: false
})
)
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

mountRoutes(app)

const path = require('path');           //this helps the google maps api show up
// const router = express.Router();     //no idea what this does 

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/map.html'));
});

app.get('/register', (req, res) => {
    res.render('regisindex.ejs')
})

app.post('/register', async (req, res) => {
    try{
        const salt = await bcrpyt.genSalt()
        const hashedPassword = await bcrpyt.hash(req.body, password, salt)
        console.log(salt)
        console.log('hashedpw = ' + hashedPassword)

        const user = { name: req.body.name, password: req.body.password }
        users.push({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        // res.status(201).send()
        res.redirect('/login')
    } catch {
        // res.status(500).send()
        res.redirect('/register')   //in case registration fails
    }
    console.log(users)
})

// middleware portion
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { 
        return next();
    }
    res.redirect('/login') //return to login if failed
}



app.delete('/logout', (req, res) => {
    req.logOut()
    req.redirect('/login')
})

// end middleware portion


const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));       

module.export = server 


