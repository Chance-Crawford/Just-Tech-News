// central hub for exporting models
const User = require('./User');
const Post = require("./Post");

// We're not done yet, however. We also need to instruct the User 
// and Post models how they can query on one another through this Vote model.
const Vote = require('./Vote');

const Comment = require('./Comment');


// create associations
// As we referenced earlier, 
// a user can make many posts. Thanks to Sequelize, 
// we can now use JavaScript to explicitly create this relation. 
// This association creates the reference for the id column in the User 
// model to link to the corresponding foreign key pair, which is the 
// user_id in the Post model.
// Here is what this means:
// A record from the User table can have many, one or more, 
// associated Post records from the Post table. This is a one
// to many relationship. The user_id is going to be the associated key between
// the two tables. So any Post records/rows with a user_id that matches the
// id record in the User table can be retrieved together.
User.hasMany(Post, {
    foreignKey: 'user_id'
});

// We also need to make the reverse association by adding the following statement.
// In this statement, we are defining the relationship of the 
// Post model to the User. The constraint we impose here is that a 
// post can belong to one user, but not many users. Again, we declare 
// the link to the foreign key, which is designated at user_id 
// in the Post model.
// Deeper explanation:
// The belongsTo statement creates a one-to-one relationship any single
// dog record can only be associated with one User record.
// A User can have many posts, but a post can only have one user. This 
// establishes the relationship between the two tables in the database, on 
// both sides.
// This completes the associations, and makes it so that they are ready
// to be implemented in an api route.
Post.belongsTo(User, {
    foreignKey: 'user_id'
    // you can also add more functionality here for the 
    // relationship between Post and user. For example:
    // onDelete: "cascade"
});

// Now we need to associate User and Post to one another in a way 
// that when we query Post, we can see a total of how many votes a 
// user creates; and when we query a User, we can see all of the posts 
// they've voted on. You might think that we can use .hasMany() on both 
// models, but instead we need to use .belongsToMany().
// With these two .belongsToMany() methods in place, we're allowing both 
// the User and Post models to query each other's information in the context 
// of a vote. If we want to see which users voted on a single post, we can 
// now do that. If we want to see which posts a single user voted on, we can 
// see that too. This makes the data more robust and gives us more capabilities 
// for visualizing this data on the client-side.
// Notice the syntax. We instruct the application that the User and Post 
// models will be connected, but in this case through the Vote model. 
// We state what we want the foreign key to be in Vote, which aligns 
// with the fields we set up in the vote model. We also stipulate that the 
// name of the Vote model should be displayed as voted_posts when queried on, 
// making it a little more informative.
// Furthermore, the Vote table needs a row of data to be a unique pairing so 
// that it knows which data to pull in when queried on. So because the 
// user_id and post_id pairings must be unique, we're protected from the 
// possibility of a single user voting on one post multiple times.
// This layer of protection is called a foreign key constraint.
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});
  
Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});


// We could be done here now—but even though we're connecting the Post and 
// User models together through the Vote model, there actually is no direct 
// relationship between Post and Vote or User and Vote. If we want to see 
// the total number of votes on a post, we need to directly connect the Post 
// and Vote models.
// By also creating one-to-many associations directly between these models, 
// we can perform aggregated SQL functions between models. In this case, 
// we'll see a total count of votes for a single post when queried. This 
// would be difficult if we hadn't directly associated the Vote model with 
// the other two.
Vote.belongsTo(User, {
    foreignKey: 'user_id'
});
  
Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});
  
User.hasMany(Vote, {
    foreignKey: 'user_id'
});
  
Post.hasMany(Vote, {
    foreignKey: 'post_id'
});


// Comment table associations

// Note that we don't have to specify Comment as a through table 
// like we did for Vote. This is because we don't need to access Post 
// through Comment; we just want to see the user's comment and which post 
// it was for. Thus, the query will be slightly different.
Comment.belongsTo(User, {
    foreignKey: 'user_id'
});
  
Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});
  
User.hasMany(Comment, {
    foreignKey: 'user_id'
});
  
Post.hasMany(Comment, {
    foreignKey: 'post_id'
});


// This completes the associations, and makes it so that they are ready
// to be implemented in an api route.
module.exports = { User, Post, Vote, Comment };