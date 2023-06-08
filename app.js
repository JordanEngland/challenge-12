require('dotenv').config();
// Import required modules
const mysql = require('mysql2');
const inquirer = require('inquirer');

// Import other files
const database = require('./database');
const menu = require('./menu');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'employee_tracker_db',
});

// Establish the database connection
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database.');

  // Start the application by calling the appropriate function
  // For example, you might call a function to display the main menu
  menu.displayMainMenu();
});
