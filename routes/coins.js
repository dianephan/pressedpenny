// run /coins
const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()

router.get('/', (req, res) => {
    res.send('View the database of coins here!')
})

router.get('/all', async (req, res) => {
    const { rows } = await db.query("SELECT * FROM coins LEFT JOIN machines ON machines.id = coins.fk_machine_id LEFT JOIN locations ON locations.fk_machine_id = machines.id;")
    res.send(rows)
})

//to view separate coins 
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    // console.log(id)
    const { rows } = await db.query(`SELECT * FROM coins WHERE id = ${id}`)
    // console.log(rows)
    res.send(rows[0])
})

// // put this in its own js page 
// router.get('/:id', async (req, res) => {
//     const id = req.params.id;
//     // console.log(id)
//     const { rows } = await db.query(`SELECT * FROM get_user_map_data(${id})`)
//     // console.log(rows)
//     res.send(rows[0])
// })

module.exports = router
