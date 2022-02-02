// For more info see google docs, ORM - notes, API routes for the user model

const express = require('express');
// takes all routes packaged in the routes/index.js file
const routes = require('./controllers');
const sequelize = require('./config/connection');

// sets up handlebars templating engine, along with app functions
// further below.
// see google docs, handlebars.js
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

// used to make static files in the public folder like style.css
// available to the client no matter where the current directory is.
const path = require('path');

const app = express();

// This uses Heroku's process.env.PORT 
// value for the port when deployed and 3001 when run locally.
const PORT = process.env.PORT || 3001;

// see google docs, Express-session and connect-session-sequelize
// Creates a user session
const session = require('express-session');

// connects the session to MySQL database using sequelize
// and allows the user session to be stored in the 
// database.
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// This code sets up an Express.js session and connects the session to our Sequelize 
// MySQL database. As you may be able to guess, "Super secret secret" should be replaced 
// by an actual secret and stored in the .env file.
// see google docs, Express-session and connect-session-sequelize
const sess = {
  secret: 'Super secret secret',
  // All we need to do to tell our session to use cookies is to set cookie 
  // to be {}. If we wanted to set additional options on the cookie, 
  // like a maximum age, we would add the options to that object.
  cookie: {},
  // see google docs, Express-session and connect-session-sequelize
  resave: false,
  saveUninitialized: true,
  // sets up session storage in the database compatible with sequelize 
  // from the variable defined above.
  store: new SequelizeStore({
    // creates storage in database from the database connection
    db: sequelize
  })
};

// express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware to make the express server use the user session we created
app.use(session(sess));

// used to make all static files in the public folder like style.css, etc.
// available to the client no matter where the current directory is.
// express.static() method is a built-in Express.js middleware function that 
// can take all of the contents of a folder and serve them as static assets. 
// This is useful for front-end specific files like images, style sheets, 
// and JavaScript files.
app.use(express.static(path.join(__dirname, 'public')));

// turn on routes
app.use(routes);

// sets up handlebars templating engine
// see google docs, handlebars.js
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

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
// such as we establish an association between one or more tables.
// We'll have to do that a few times throughout this project, so it's best to 
// keep the {force: false} there for now, and we will change it to true to 
// refresh the tables when needed.
// This definition performs similarly to DROP TABLE IF EXISTS, which was 
// used previously. This allows the table to be overwritten and re-created.
// Then we should change this value back to false. Dropping all the tables 
// every time the application restarts is no longer necessary and in 
// fact will constantly drop all the entries and seed data we enter, 
// by using the post User api route.
// which can get very annoying.
// change value to true whenever a new association is made between tables,
// so that the tables can refresh and the associations can be applied.
// server will start with npm start.
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});