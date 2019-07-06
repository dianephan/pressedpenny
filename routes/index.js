const coins = require('./homepage')

module.exports = (app) => {
    app.use('/coins', coins)
}