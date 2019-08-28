/*
    index.js is inside /routes to route us to the coins page 
*/

const coins = require('./coins')
<<<<<<< HEAD
const users = require('./users')
=======
const userdata = require('./login')
>>>>>>> ef2891ac45a3eed91016771fb3bc4a6c66848fe6

module.exports = (app) => {
    app.use('/coins', coins)
    // just syntax to use what's in the "coins" route 
<<<<<<< HEAD
    app.use('/users', users) // <<---- HERE!
=======
    app.use('/login', userdata)  // <<---- HERE!
>>>>>>> ef2891ac45a3eed91016771fb3bc4a6c66848fe6
}

// Don't do this. Put other routes inside the exports
// module.exports = (app) => {
//     app.use('/login', userdata)
// }
<<<<<<< HEAD


=======
>>>>>>> ef2891ac45a3eed91016771fb3bc4a6c66848fe6

