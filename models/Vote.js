const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// As we've established, the concept of relationships between data is 
// integral to databases. Using Sequelize, we just created a one-to-many 
// relationship that connects the User and Post models, in which users can 
// create many posts and posts belong to a single user. In one-to-many 
// relationships like this, the owned data entity (i.e., the post that a user 
// creates) holds a reference to its owner. The owner holds no reference to 
// the data it owns, to prevent unnecessary duplication.
// But now we want to allow many users to vote on many posts, creating a 
// many-to-many relationship. In this relationship, each side must hold 
// a reference to its counterpart, as they each share ownership in a vote. 
// So we need to create a third table, for the sole purpose of connecting 
// the data between two other tables with their primary keys. This is known 
// as a through table. Let's create one now!
class Vote extends Model {}

Vote.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // with the 2 properties below we can track the posts
    // that users vote on. 
    // When a user votes on a post, we'll insert a new row of 
    // data to the table, which lists the primary key of the user 
    // and the primary key of the post they voted on.
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        }
      },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'post',
            key: 'id'
        }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'vote'
  }
);

module.exports = Vote;