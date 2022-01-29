// For more info see google docs, ORM - notes,
// Creating a class model with sequelize
// Also see User.js for more info and comments.
// Next, we'll import the elements that we'll need to build the 
// Post model. This will include the connection to MySQL we stored 
// in the connection.js file as well as Model and Datatypes we'll 
// use from the sequelize package.
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Post model
// Also see User.js for more info and comments.
class Post extends Model {}

// createand define fields/columns for Post model
// defining the Post schema
Post.init(
    {
      // id is the primary key of the model/table, auto increments
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      post_url: {
        type: DataTypes.STRING,
        allowNull: false,
        // built into sequelize, makes sure the string
        // follows the format of a valid URL
        validate: {
          isURL: true
        }
      },
      // this column determines who posted the news article. 
      // Using the references property, we establish the 
      // relationship between this post and the user by creating a 
      // reference to the User model, specifically to the id column 
      // that is defined by the key property, which is the 
      // primary key of the User model. 
      // The user_id is conversely defined as the foreign key and will 
      // be the matching link between the two models/tables.
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'user',
          key: 'id'
        }
      }
    },
    // In the second parameter of the init method, we configure 
    // the metadata, including the naming conventions.
    {
      // pass the current connection instance to initialize the Post model
      sequelize,
      // configure the naming conventions of the table/model
      freezeTableName: true,
      // we defined the column names to have an underscore naming 
      // convention by using the underscored: true, assignment. 
      // In Sequelize, columns are camelcase by default.
      underscored: true,
      modelName: 'post'
    }
);


module.exports = Post;