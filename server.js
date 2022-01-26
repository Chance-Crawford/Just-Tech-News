// For more info see google docs, ORM - notes, API routes for the user model

const express = require('express');
// takes all routes packaged in the routes/index.js file
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// turn on connection to MySQL db and express server
// Also, note we're importing the connection to Sequelize 
// from config/connection.js. Then, at the bottom of the file, 
// we use the sequelize.sync() method to establish the connection to the database. 
// The "sync" part means that this is Sequelize taking the models and 
// connecting them to associated database tables. If it doesn't find a table, 
// it'll create it for you!
// The other thing to notice is the use of {force: false} 
// in the .sync() method. This doesn't have to be included, but if it 
// were set to true, it would drop and re-create all of the database tables on 
// startup. This is great for when we make changes to the Sequelize models, 
// as the database would need a way to understand that something has changed. 
// We'll have to do that a few times throughout this project, so it's best to 
// keep the {force: false} there for now.
// server will start with npm start.
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});