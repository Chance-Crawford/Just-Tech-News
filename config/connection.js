// For more info see google docs, ORM - notes,
// Connect to the database using Sequelize.
// import the Sequelize constructor from the library
const Sequelize = require('sequelize');

// For more info see google docs, ORM - notes,
// set up environment variables
// uses the .env file to hide our MySQL username and password
require('dotenv').config();

// create connection to our database, pass in your MySQL information for username and password
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});

module.exports = sequelize;