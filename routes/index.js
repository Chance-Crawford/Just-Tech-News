// see google docs, ORM - Notes, API routes for the user model
// index.js file that collects the endpoints and prefixes them, 
// here we are collecting the packaged group of API endpoints and prefixing 
// them with the path /api
// Now when we import the routes to server.js, they'll 
// already be packaged and ready to go with this one file!
const router = require('express').Router();

const apiRoutes = require('./api');

router.use('/api', apiRoutes);

// This is so if we make a request to any endpoint that 
// doesn't exist, we'll receive a 404 error indicating we have 
// requested an incorrect resource, another RESTful API practice.
router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;