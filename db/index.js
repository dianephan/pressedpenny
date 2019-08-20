const { Pool, Client } = require('pg')

// this const pool is required to access database on heroku
// also had to delete .env file (local) because it might have overwritten heroku's .env file

// const pool = new Pool({
//   user: 'njolazjolmpfjq',
//   host: 'ec2-174-129-29-101.compute-1.amazonaws.com',
//   database: 'de5fegld6d1g6s',
//   password: 'a6b2015130575c9cc5497582aaa6d2a811b99da613d38c2fb00deee85560f404',
//   port: 5432,
//   connectionString: process.env.DATABASE_URL,
//   ssl: true,
// });

// const client = new Client({
//   user: 'njolazjolmpfjq',
//   host: 'ec2-174-129-29-101.compute-1.amazonaws.com',
//   database: 'de5fegld6d1g6s',
//   password: 'a6b2015130575c9cc5497582aaa6d2a811b99da613d38c2fb00deee85560f404',
//   port: 5432,
//   ssl: true,
// })

const pool = new Pool({
  user: '',
  host: 'localhost',
  database: 'pennydb',
  password: '',
  port: 5432,
  connectionString: '',
});

const client = new Client({
  user: '',
  host: 'localhost',
  database: 'pennydb',
  password: '',
  port: 5432,
  connectionString: '',

})

client.connect()

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
}
