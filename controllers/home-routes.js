
// see google docs, handlebars.js
// basicall acts as the html get routes that return HTML pages.
// But these HTML pages are populated with data using handlebars template engine
const router = require('express').Router();

// In the api/post-routes.js file, we already have a Sequelize Post.findAll() 
// query set up to return all posts and their nested properties. We'll use this 
// same query to populate the homepage template.
// First, import the necessary modules and models into home-routes.js/
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// set up the main homepage route.
// returns an HTML file which uses handlebars to populate the post data
// into the homepage template defined in views/homepage.handlebars
router.get('/', (req, res) => {

  // see google docs, Express-session and connect-session-sequelize
  // console logs the session variables.
  // we define session variables in the login and create user
  // routes in user-routes.js. Every time a user logs in or creates an account
  // for a user, a new session is made.
  // Go back to your app, log in, and navigate to the homepage. 
  // Voila! This route now has access to our user's session!
  // even on the homepage or any other pages.
  console.log(req.session);

    Post.findAll({
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
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
        // .get, The data that Sequelize returns is actually a Sequelize object with a 
        // lot more information attached to it than you might have been expecting. 
        // To serialize the object down to only the properties you need, you can use 
        // Sequelize's get() method.
        // You didn't need to serialize data before when you built API routes, 
        // because the res.json() method automatically does that for you.
        // Takes all posts in the post array returned from the database
        // and serializes it into reqular objects we can use to fill the template
        const posts = dbPostData.map(post => post.get({ plain: true }));
        // pass post objects into the homepage template.
        // Previously, we used res.send() or res.sendFile() for the response. 
        // Because we've hooked up a template engine, we can now use res.render() and 
        // specify which template we want to use and render() automatically gets the 
        // template from the "views" folder. In this case, we want to render the 
        // homepage.handlebars template (the .handlebars extension is implied). This 
        // template was light on content; it only included a single <div>. 
        // Handlebars.js will automatically feed that into the main.handlebars 
        // template, however, and respond with a complete HTML file. This is because
        // the HTML in the main file is automatically set to be returned at the root of the 
        // server. And we made the homepage html render at the root as well with this
        // get request. So the homepage html will be populated within the 
        // {{{ body }}} place holder in main.

        // Now we can plug that posts array above into the template. However, even though the 
        // render() method can accept an array instead of an object, that would 
        // prevent us from adding other properties to the template later on. To avoid 
        // future headaches, we can simply add the array to an object and continue 
        // passing an object to the template.
        // This will momentarily break the template again, because the template was 
        // set up to receive an object with an id property, title property, and so on. 
        // Now the only property it has access to is the posts array. Fortunately, 
        // Handlebars.js has built-in helpers that will allow you to perform minimal 
        // logic like looping over an array. We do this by using #each in the template.
        // Note the use of {{#each posts}} to begin the loop and {{/each}} to define where it 
        // ends in the homepage file. 
        // Any HTML code in between (e.g., the <li> element) will be repeated 
        // for every item in posts.
        // Within the {{#each}} block, Handlebars.js is smart enough to know that 
        // it's working with an object on each iteration, so it looks for the necessary properties.
        // We can make this a little clearer, however, by declaring a variable name in the 
        // {{#each}} expression and using that name for the subsequent placeholders.
        // ex. {{#each posts as |post|}}, then in every placeholder you would use post.<property>
        // dot notation.
        res.render('homepage', { posts });

      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

// login page html template route
router.get('/login', (req, res) => {
  // see google docs, Express-session and connect-session-sequelize
  // check for a session using the session variables we added to the req object in
  // user-routes.js, and redirect to the homepage if a session already exists.
  // Now let's return to the browser and test it. Log in, then try navigating to 
  // the login route. You should be automatically redirected to the homepage. 
  // You can even restart the server and it still works!
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;