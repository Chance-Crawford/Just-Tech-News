// For more info see google docs, ORM - notes,
// Creating a class model with sequelize
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
// For more info see google docs, ORM - notes, 
// User password encryption for security with bcrypt
const bcrypt = require('bcrypt');

// create our User model from the model class
// so User inherits all of the functionality the Model class has.
class User extends Model {
  // set up method to run on instance data (per user) to check password.
  // Uses bcrypt to check if a plain text password is equal to the
  // hashed password stored in the database. Used to authenticate users
  // safely in user-routes.js post method for /login
  checkPassword(loginPw) {
    // Using the keyword this, we can access this user's 
    // properties, including the password, which was stored as a hashed string.
    // it is prefered to run this functions async version on a live website
    // but for testing purposes, we are using the sync version.
    return bcrypt.compareSync(loginPw, this.password);
  }
}

// Once we create the User class, we use the 
// .init() method to initialize the user model's data and 
// configuration, passing in two objects as arguments. 
// The first object will define the columns and data types 
// for those columns. The second object it accepts configures 
// certain options for the table.
// define table columns and configuration
User.init(
  {
    // Now that we have the model's base information set up, 
    // let's define the column names and what rules they 
    // should adhere to.
    // TABLE COLUMN DEFINITIONS GO HERE
    // define an id column
    id: {
        // use the special Sequelize DataTypes object provide 
        // what type of data it is
        type: DataTypes.INTEGER,
        // this is the equivalent of SQL's `NOT NULL` option
        allowNull: false,
        // instruct that this is the Primary Key
        primaryKey: true,
        // turn on auto increment
        autoIncrement: true
    },
    // define a username column
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // define an email column
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        // there cannot be any duplicate email values in this table
        unique: true,
        // if allowNull is set to false, we can run our data 
        // through validators before creating the table data
        // Sequelize's built-in validators are another great feature. 
        // We can use them to ensure any email data follows the pattern of 
        // an email address (i.e., <string>@<string>.<string>) so no 
        // one can give us incorrect data. There are a lot of prebuilt 
        // validators we can use from Sequelize, but you can also make your own, 
        // so it's worth reading through the documentation to see what's available to you.
        validate: {
            isEmail: true
        }
    },
    // define a password column
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            // this means the password must be at least four 
            // characters long
            len: [4]
        }
    }
  },
  {
    // TABLE CONFIGURATION OPTIONS GO HERE 
    // (https://sequelize.org/v5/manual/models-definition.html#configuration))

    // Now that we have an idea of how to create a hashed password, where 
    // can we use this function in the course of the application? In other 
    // words, how do we inject this logic to occur just before a user is created?
    // Thankfully, we can use special Sequelize functions called hooks in 
    // the model. Also known as lifecycle events, hooks are functions 
    // that are called before or after calls in Sequelize.
    // We'll be working in the User.js file, so we can modify the User 
    // model and add the appropriate hooks at opportune moments to hash the 
    // password.
    // According to the Sequelize documents, to use hooks, we must pass 
    // in another object labelled hooks to the User.init() function.
    // For more info see google docs, ORM - notes, 
    // User password encryption for security with bcrypt.
    hooks: {
      // set up beforeCreate lifecycle "hook" functionality
      // Thankfully, the hooks have semantic names that declare when 
      // they can be called. In our case, we need a hook that will 
      // fire just before a new instance of User is created. The 
      // beforeCreate() hook is the correct choice.
      
      // use bcrypt before the user is created to take the user object.
      // The keyword pair, async/await, works in tandem to make this 
      // async function look more like a regular synchronous function expression.
      // async and await works on async functions such as functions that
      // return promises etc. The keywords can be used as
      // a different way of capturing data from promises without needing a 
      // "then" function
      // The async keyword is used as a prefix to the function 
      // that contains the asynchronous function. await can be used 
      // to prefix the async function, which will then gracefully 
      // assign the value from the response to the newUserData's 
      // password property. The newUserData is then returned to the 
      // application with the hashed password.
      async beforeCreate(newUserData) {
        // get its password from the password property, have the saltRound
        // parameter hash the plaintext password by 10, higher the better.
        // the resulting hashed password is then returned in a promise object
        // which we are awaiting to finish hashing, after it is finished
        // we add it to the newUserData.password property
        // Nice work. We used a new package, bcrypt, to hash the password 
        // and used a hook to hash the password just before it 
        // was saved to the database.
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },

      // Let's add a hook, like we did previously for the create 
      // operation, this time for the update operation.
      // set up beforeUpdate lifecycle "hook" functionality
      // Before we can check to see if this hook is effective 
      // however, we must add an option to the query call. 
      // According to the Sequelize documentation regarding the 
      // beforeUpdate (Links to an external site.), we will need 
      // to add the option { individualHooks: true }.
      // Navigate to the query call in the user-routes.js 
      // file for the User.update function in the PUT route 
      // to update the password.
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        return updatedUserData;
      }
      
    },
    // pass in our imported sequelize connection 
    // (the direct connection to our database)
    sequelize,
    // don't automatically create 
    // createdAt/updatedAt timestamp fields
    timestamps: false,
    // don't pluralize name of database table
    freezeTableName: true,
    // use underscores instead of camel-casing 
    // (i.e. `comment_text` and not `commentText`)
    // In Sequelize, columns are camelcase by default.
    underscored: true,
    // make it so our model name stays lowercase in the database
    modelName: 'user'
  }
);

// Lastly, export the newly created model so we 
// can use it in other parts of the app.
module.exports = User;