const express = require('express');
const session = require('express-session');
const mountRoutes = require('./routes/index');
const env = require('dotenv').config();
var bodyParser = require('body-parser');
const path = require('path');           //this helps the google maps api show up
const db = require('./db');
const app = express();

mountRoutes(app)        //this helps generate the map 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/resources/html/map.html'));
});

//please ignonre /collect and /coininsert. it may or may not be used in the final project 
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

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`)).on("error", console.log);

module.export = server
