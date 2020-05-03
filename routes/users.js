const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()
const path = require('path');           //this helps the google maps api show up
var session = require('express-session')

///////////////////////////////////

// router.use(session({
//     // should secret be the user id? 
//     secret: 'keyboard cat',  
//     resave: false,
//     saveUninitialized: true
// }))
   
// router.use(function (req, res, next) {
//     if (!req.session.views) {
//         req.session.views = {}
//     }
//     // get the url pathname
//     var pathname = parseurl(req).pathname
//     // count the views
//     req.session.views[pathname] = (req.session.views[pathname] || 0) + 1
//     next()
// })

// router.get('/foo', function (req, res, next) {
//     res.send('you viewed this page ' + req.session.views['/foo'] + ' times')
// })

///////////////////////////////////

// router.get('/',(req,res) => {
//     let sess = req.session;
//     if(sess.email) {
//         return res.redirect('/admin');
//     }
//     res.sendFile('index.html');
// });




////////////////////////////////////





//delete once project is done lool 
router.get('/all', async (req, res) => {
    const { rows } = await db.query("SELECT * FROM users; ")
    res.send(rows)
})

// // /user/register <-- will only use this call in the frontend. User won't type it in
// router.post('/register', async (req, res) => {     // use post bc sensitive data  
//     const userid = req.body.userid
//     const email = req.body.email
//     const pass = req.body.password
//     const myQuery = `SELECT insert_user('${userid}', '${email}', '${pass}')`
//     await db.query(myQuery)
//     res.send("Success boyo")
// })



// app.post('/login',(req,res) => {
//     req.session.email = req.body.email;
//     res.end('done');
// });



// router.post('/login', async (req, res) => {
//     const email = req.body.email
//     const pass = req.body.password
//     const myQuery = `SELECT EXISTS (SELECT 1 FROM users WHERE email = '${email}' AND  pass = '${pass}')`
//     const result = await db.query(myQuery)
//     console.log(result.rows[0].exists)
//     if (result.rows[0].exists) {
//         // res.send("Successful login.")
//         res.sendFile(path.join(__dirname + '/../resources/html/map.html'));
//     } else {
//         res.send("not scucessful")
//     }

// })

// this gets run after the user logins first 
router.post('/collect', async (req, res) => {
    const machine = req.body.machine
    const coin = req.body.coin

    // const email = req.body.email
    // const machinename = req.body.machinename
    // const coinname = req.body.coinname
    // const myQuery = `SELECT insert_coin_entry('${userid}', '${email}', '${pass}');`

    // (fk_user INT, fk_coins INT, input_year INT) 
    // const myQuery = `INSERT INTO users (email, machinename, coinname) VALUES ('${email}', '${machinename}', '${coinname}')`
    // await db.query(myQuery)
    res.send("successful insertion")
})

// // put this in its own js page 
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const { rows } = await db.query(`SELECT * FROM get_user_map_data(${id})`);
    res.send(rows)
})

module.exports = router

