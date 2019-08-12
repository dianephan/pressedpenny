/*
    index.js is inside /routes to route us to the coins page 
*/

const coins = require('./homepage')

module.exports = (app) => {
    app.use('/coins', coins)
    // just syntax to use what's in the "coins" route 

}


