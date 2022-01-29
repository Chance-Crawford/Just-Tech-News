// For more info see google docs, ORM - notes,
// Connect to the database using Sequelize.
// import the Sequelize constructor from the library
const Sequelize = require('sequelize');

// For more info see google docs, ORM - notes,
// set up environment variables
// uses the .env file to hide our MySQL username and password
require('dotenv').config();

// create connection to our database, pass in your MySQL 
// information for username and password.
// this changes our connection to the database depending on whether
// we are running the app locally or it is deployed to heroku.
// Jawsdb is the database add on in heroku, if there is a process.env
// for jaws, that means we are running the app's server through heroku, and
// the app is deployed to heroku. In that case, connect to the heroku remote
// MySQL database hosted by heroku.
// If there is not that environmental variable, then we will create the 
// connection to our MySQL database locally, using the localhost configuration.
let sequelize;

if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  });
}

module.exports = sequelize;