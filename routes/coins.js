// run /coins
const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()

router.get('/', (req, res) => {
    res.send('View the database of coins here!')
})

router.get('/all', async (req, res) => {
    const { rows } = await db.query("SELECT * FROM locations")
    res.send(rows)
})

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    // console.log(id)
    const { rows } = await db.query('SELECT * FROM locations WHERE id = $1', [id])
    // console.log(rows)
    res.send(rows[0])
})

module.exports = router