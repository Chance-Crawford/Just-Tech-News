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
class Post extends Model {
  // Here, we're using JavaScript's built-in static keyword to 
  // indicate that the upvote method is one that's based on the Post 
  // model and not an instance method like we used earlier with the User model.
  // This means that the method can be called on the model itself.
  // ex. Post.upvote().
  // We've set it up so that we can now execute Post.upvote() as if it 
  // were one of Sequelize's other built-in methods. With this upvote method, 
  // we'll pass in the value of req.body (as body) and an object of the models 
  // (as models) as parameters. Because this method will handle the complicated 
  // voting query in the /api/posts/upvote route, let's implement that query's code here.
  static upvote(body, models) {
    // creates a new vote for the Vote model.
    // We are having the vote model passed in as an argument so that 
    // we do not have to require it here in the Post model definition.
    // when this method is called, a new upvote will be made and the post
    // instance that was voted on will be returned.
    return models.Vote.create({
      user_id: body.user_id,
      post_id: body.post_id
    }).then(() => {
      return Post.findOne({
        where: {
          id: body.post_id
        },
        attributes: [
          'id',
          'post_url',
          'title',
          'created_at',
          [
            sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
            'vote_count'
          ]
        ]
      });
    });
  }
}

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