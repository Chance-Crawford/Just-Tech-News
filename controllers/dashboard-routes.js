// see google docs, handlebars.js, Building a dashboard for logged in users.
// HTML template routes for dashboard.handlebars
const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// custom middleware function we made to verify that the user is logged in before
// accessing /dashboard page before the anonymous function runs next to return the dashboard
// page. If user is not logged in, they get redirected to login page instead
const withAuth = require('../utils/auth');

// renders HTML template for user dashboard page by sending the template
// data to populate the HTML page based on the user's info.
// Take a moment to visualize the order here. When withAuth() calls next(), 
// it will call the next (anonymous) function. However, if withAuth() calls 
// res.redirect(), there is no need for the next function to be called, because 
// the response has already been sent.
router.get('/', withAuth, (req, res) => {
    // the dashboard should only display posts created by the logged in user, 
    // you can add a where object to the findAll() query that uses the id 
    // saved on the session.
    Post.findAll({
        where: {
          // use the ID from the session
          user_id: req.session.user_id
        },
        attributes: [
          'id',
          'post_url',
          'title',
          'created_at',
          [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            // include all comments made on the user's post
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
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
          // serialize data before passing to template
          const posts = dbPostData.map(post => post.get({ plain: true }));
          // pass object containing posts array and the loggedIn boolean to the template.
          res.render('dashboard', { posts, loggedIn: true });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
});


// renders HTML template for editing a post
router.get('/edit/:id', withAuth, (req, res)=>{
  // find the post in the database where id matches the id passed in the request url
    Post.findOne({
      where: {
        id: req.params.id
      },
      // attributes we want from the post object returned from the database
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        // vote_count property
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
        // include all comments associated with this post and the users who made the comments
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        // include the user who made the post
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        // make sure post with that id exists
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }

        // serialize the data object returned from the database.
        const post = dbPostData.get({ plain: true });

        // render the HTML template by passing it the data
        res.render('edit-post', {
          post,
          loggedIn: true
        });
      })
      // catch a server error if it occurs
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
})


module.exports = router;