import mysql from 'mysql2'
import logger from './logger.js'
import dotenv from "dotenv"
dotenv.config()

const sql = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB
});

sql.on("connect", () => {
    logger.log("SQL", "Connected")
})

sql.on('error', function(err) {
    console.log(err);
    logger.log("SQL", "Error:", err.sqlMessage)
});


export default sql