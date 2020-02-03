const mysql = require("mysql");
const config = require("config");

const db = mysql.createConnection({
  host: config.get("dbHost"),
  user: config.get("dbUser"),
  password: config.get("dbPassword"),
  database: config.get('dbDatabase')
});

const connectDB = async () => {
  await db.connect(err => {
    if (err) {
      console.log(err);
    } else {
      console.log("mysql connected");
    }
  });
};

// Create Database

const createDB = async () => {    
  await db.query("CREATE DATABASE mernschool", err => console.log(err));
};

// Create tables
const createTables = async () => { 
    await db.query(
        "CREATE TABLE users(id int AUTO_INCREMENT, username VARCHAR(255), email VARCHAR(255), password VARCHAR(255), image VARCHAR(255), created DATE, passwordDate DATE, PRIMARY KEY(id))",
        err => console.log(err)
    );
};

// Query database
const queryDB = async (table, query) => {
    await db.query(`INSERT INTO ${table} SET ?`, query);
}

module.exports = db;
