require("dotenv").config();
const mysql = require("mysql");
const Promise = require("bluebird");

//設定資料庫連線
let connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,

});
//connection->Promise化
connection = Promise.promisifyAll(connection);

// exports.connection = connection;
module.exports = connection;
// console.log(connection)
