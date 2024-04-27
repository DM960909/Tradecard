
const mysql  = require("mysql2");
const dotenv = require("dotenv").config();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "Pokemon2",
    port: 8889

});



module.exports =  db;