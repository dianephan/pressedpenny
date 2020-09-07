const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()

router.get('/', (req, res) => {
    res.send('View the database of coins here!')
})

router.get('/all', async (req, res) => {
    const { rows } = await db.query("SELECT coins.id, coinname, machinename, latitude_value, longitude_value FROM coins INNER JOIN machines ON coins.fk_machine_id=machines.id INNER JOIN locations ON coins.fk_machine_id=locations.fk_machine_id;")
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



//please ignonre /collect and /coininsert. it needs to be only accessible by admin 
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




module.exports = router
