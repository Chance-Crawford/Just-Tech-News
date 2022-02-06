// see google docs, ORM - Notes, API routes for the user model, AND
// user-routes.js for more comments
const router = require('express').Router();
// In a query to the post table, we would like to retrieve 
// not only information about each post, but also the user 
// that posted it. With the foreign key, user_id, we can 
// form a JOIN, an essential characteristic of the relational data model.
const { Post, User, Vote, Comment } = require('../../models');

// only used for vote PUT request so that we can query
// raw SQL query to get the number of votes on a post.
const sequelize = require('../../config/connection');

// get all posts
router.get('/', (req, res) => {
    console.log('======================');
    // Sequelize method
    // see google docs, ORM - Notes, Join tables with sequelize
    Post.findAll({
        // Specifying which columns we want to retrieve from the GET
        // query. We not only want the regular Post columns, but
        // we also want the user who made the post and
        // when the Post was created, but we dont need when the post
        // was updated, so we are specifying exactly which columns
        // we want returned from the database in our post object
        // The created_at column is auto-generated at the time a post 
        // is created with the current date and time, thanks to Sequelize. 
        // We do not need to specify this column or the updated_at column 
        // in the model definition, because Sequelize will timestamp these 
        // fields by default unless we configure Sequelize not to.
        // see lower put request for sequelize.literal, a 
        // literal SQL query that counts
        // how many total votes that a post has.
        // select the count of all the votes in the vote table where 
        // the post_id foreignkey is equal to the id of the current post
        // that is being formated into an object.
        attributes: ['id', 'post_url', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
        // In order to show the latest news first, we need to use the order 
        // property. Which column do you think we should order? To ensure 
        // that the latest news articles are shown first to the client, we 
        // can use the created_at column, which will display the most 
        // recently added posts first.
        order: [['created_at', 'DESC']],
        // see google docs, ORM - Notes, Join tables with sequelize
        // In the next step, we'll include the JOIN to the User table. 
        include: [
            // Whenever all of the posts are requested, all of the comments
            // associated with that post will be returned too.
            // include the Comment model here:
            {
              model: Comment,
              attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
              // attaches the user who made the comment inside the comment object
              // as well, so that it can have the user's username who made the 
              // comment.
              include: {
                model: User,
                attributes: ['username']
              }
            },
            // so we can get the name of the user who created the post.
            // We do this by adding the property include.
            // Notice that the include property is expressed as an array 
            // of objects. To define this object, we need a reference to 
            // the model and attributes. Can you imagine a circumstance 
            // where more than one table JOIN would be necessary?
            // The include property will match the correct user to the post
            // by accessing the user_id foreign key in the Post object.
            {
              // this is including the username column from the
              // correct User, and sending the request to the database
              // in one call to return a group of Post objects all
              // with the correct usernames and other post data.
              // Just like a JOIN SQL command.
              model: User,
              attributes: ['username']
            }
        ]
    })
    // Now that the query is done, we need to create a Promise 
    // that captures the response (Post objects) from the database call.
    // send all the objects to the front end as the response to the api
    .then(dbPostData => res.json(dbPostData))
    // catch an error if something is wrong with the database
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  
});


// gets a single post as well as the user who created the
// post based on the post's id
router.get('/:id', (req, res) => {
    Post.findOne({
      // used the where property to find the singular Post in the database
      // where the id is equal to the id specified in the route url
      where: {
        // retrieves the id specified in the route.
        id: req.params.id
      },
      attributes: ['id', 'post_url', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
      include: [
        // returns comments associated with the post
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          // attaches the user who made the comment inside the comment object
          // as well, so that it can have the user's username who made the 
          // comment.
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        // return in the response the post info and the user who created
        // it
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});


// posts a post
router.post('/', (req, res) => {
    // expects 
    // {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
    Post.create({
      // essentially like INSERT INTO (title, post_url, user_id)
      // VALUES (......)
      // We do not assign the created_at or updated_at fields in req.body
      // because sequelize adds those fields automatically based on the
      // current time.
      title: req.body.title,
      post_url: req.body.post_url,
      // gets the user id of the user who is making the post from the session.
      user_id: req.session.user_id
    })
    // sends back post row (object) that was created in the database
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


// PUT /api/posts/upvote
// When we vote on a post, we're technically updating that post's data. 
// This means that we should create a PUT route for updating a post.
// Make sure this PUT route is defined before the /:id PUT route, though. 
// Otherwise, Express.js will think the word "upvote" is a valid 
// parameter for /:id.
router.put('/upvote', (req, res) => {
  // make sure the session exists first, this means user is logged in.
  // see google docs, Express-session and connect-session-sequelize for more
  // details
  if (req.session) {
    // upvote is a custom static method we made for the post model.
    // when an upvote is made on the frontend, we only pass the post_id in the api
    // call, not the user id. Here in the backend we will 
    // pass user_id stored in session along with all destructured properties on req.body
    // (which is just the post_id).
    // We're doing two things here. First, we're checking that a session 
    // exists before we even touch the database. Then if a session does exist, 
    // we're using the saved user_id property on the session to insert a new 
    // record in the vote table.
    // This means that the upvote feature will only work if someone has logged in.
    // The first time you click the upvote button, the page will refresh, and the 
    // comment count will have gone up by one.
    Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
      .then(updatedVoteData => res.json(updatedVoteData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  }
});


// Update the title of a post based on the post's id.
// the idea is to first retrieve the post instance by 
// id, then alter the value of the title on this instance of a post.
router.put('/:id', (req, res) => {
    Post.update(
      {
        title: req.body.title
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
    .then(dbPostData => {
    if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
    }
    // the response from the web application will be just a 1. 
    // This response may seem odd, but it is SQL's way to verify that 
    // the number of rows changed in the last query.
    res.json(dbPostData);
    })
    .catch(err => {
    console.log(err);
    res.status(500).json(err);
    });
});


// Delete a post based on id
// we will use Sequelize's destroy method and using the 
// unique id in the query parameter to find then delete this instance of the post.
router.delete('/:id', (req, res) => {
    Post.destroy({
      where: {
        id: req.params.id
      }
    })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      // The response from the request from SQL displays the number 
      // of rows or entries that were affected by this query.
      // In this case it should be 1.
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  });



module.exports = router;