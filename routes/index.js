/*
    index.js is inside /routes to route us to the coins page 
    these routes help developer view the queries from specific tables 
*/
const coins = require('./coins')
const users = require('./users')
const admin = require('./admin')

//put routes inside this exports module 
module.exports = (app) => {
    app.use('/coins', coins)
    // just syntax to use what's in the "coins" route 
    app.use('/users', users) 
    app.use('/admin', admin) 

}

