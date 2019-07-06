// run /coin
const Router = require('express-promise-router')

const db = require('../db')

const router = new Router()
module.exports = router

router.get('/', (req, res) => {
    res.send('Helo')
})

router.get('/all', async (req, res) => {
    // const id = req.params.id;
    // console.log(id)
    const { rows } = await db.query('SELECT * FROM locations')
    // console.log(rows)
    // res.send
   
    res.send(rows)
})

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    // console.log(id)
    const { rows } = await db.query('SELECT * FROM locations WHERE id = $1', [id])
    // console.log(rows)
    res.send(rows[0])
})





