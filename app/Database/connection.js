const util = require('util')
const mysql = require('mysql')
const env = require('../Config/env')

const options = {
  host     : env.NODE_ENV === 'development' ? env.DB_HOST : env.DB_HOST_PROD, 
  database : env.NODE_ENV === 'development' ? env.DB_DATABASE : env.DB_DATABASE_PROD,
  user     : env.NODE_ENV === 'development' ? env.DB_USERNAME : env.DB_USERNAME_PROD,
  password : env.NODE_ENV === 'development' ? env.DB_PASSWORD : env.DB_PASSWORD_PROD,
  dateStrings:true
}

const db = mysql.createPool(options)
db.getConnection((err, connection) => {
    if (err) console.error
    if (connection) {
      console.log('conection')
      connection.release()  
    }
    return
})
db.query = util.promisify(db.query)

module.exports = db;