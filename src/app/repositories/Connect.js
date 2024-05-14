require('dotenv').config()
const knexPaginate = require('knex-paginate')
knexPaginate.attachPaginate();
const Connect = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
  }
})



module.exports = Connect