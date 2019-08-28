const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()

// /user/register <-- will only use this call in the frontend. User won't type it in
router.post('/register', async (req, res) => {
    const userID = req.body.userID
    const email = req.body.email
    const pass = req.body.password
    const myQuery = `INSERT INTO users (userID, email, pass) VALUES ('${userID}', '${email}', '${pass}')`
    await db.query(myQuery)
    res.send("Success boyo")
})

router.post('/login', async (req, res) => {
    const email = req.body.email
    const pass = req.body.password

    const myQuery = `SELECT EXISTS (SELECT 1 FROM users WHERE email = '${email}' AND  pass = '${pass}' )`
    const result = await db.query(myQuery)
    console.log(result.rows[0].exists)
    if (result.rows[0].exists) {
        res.send("Success login")
    } else {
        res.send("not scucessful")
    }

})

// this gets run after the user logins first 
router.post('/collected', async (req, res) => {
    const email = req.body.email
    const machinename = req.body.machinename
    const coinname = req.body.coinname

    const myQuery = `INSERT INTO users (email, machinename, coinname) VALUES ('${email}', '${machinename}', '${coinname}')`
    await db.query(myQuery)
    res.send("Success successful insertion")
})

module.exports = router

