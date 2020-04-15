// is this even needed anymore? since app.js renders logindex.ejs   

// run /login
const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()

router.get('/', (req, res) => {
    res.render('logindex.ejs')
})

// router.get('/', async (req, res) => {
//     const { rows } = await db.query("SELECT * FROM locations")
//     res.send(rows)
// })

module.exports = router


