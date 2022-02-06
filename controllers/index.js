// see google docs, ORM - Notes, API routes for the user model
// index.js file that collects the endpoints and prefixes them, 
// here we are collecting the packaged group of API endpoints and prefixing 
// them with the path /api
// Now when we import the routes to server.js, they'll 
// already be packaged and ready to go with this one file!
const router = require('express').Router();

const apiRoutes = require('./api');

const homeRoutes = require('./home-routes.js');

const dashboardRoutes = require('./dashboard-routes.js');

router.use('/api', apiRoutes);
// all handlebar view routes related to the homepage are prefixed with nothing except /
router.use('/', homeRoutes);
// Now all dashboard handlebar views will be prefixed with /dashboard. In dashboard-routes.js
router.use('/dashboard', dashboardRoutes);

// This is so if we make a request to any endpoint that 
// doesn't exist, we'll receive a 404 error indicating we have 
// requested an incorrect resource, another RESTful API practice.
router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;