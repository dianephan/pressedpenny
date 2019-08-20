/*
    index.js is inside /routes to route us to the coins page 
*/

const coins = require('./coins')
const userdata = require('./login')

module.exports = (app) => {
    app.use('/coins', coins)
    // just syntax to use what's in the "coins" route 
    app.use('/login', userdata)  // <<---- HERE!
}

// Don't do this. Put other routes inside the exports
// module.exports = (app) => {
//     app.use('/login', userdata)
// }

