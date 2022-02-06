// see google docs, handlebars.js, Protect Routes with Middleware

// Earlier, you added a conditional in the main layout to hide the dashboard link if 
// the user isn't logged in. However, there's nothing to stop a user who isn't logged 
// in from directly typing /dashboard in the browser, thus skipping the login page.

// Fortunately, if this happens, the back end will simply send a status code of 
// 500 as the response, because the line user_id: req.session.user_id will result in an 
// error when there's no session. Seeing a broken page isn't a great user experience, 
// though, even if that user was trying to circumvent your login page.

// A better approach would be to redirect a user who isn't logged in to the /login 
// route whenever they try to access a route meant for authenticated users.

// Let's try this out with our own middleware function that can authguard routes. 
// To authguard a route means to restrict it to authenticated users only.

// This function will act as a normal request callback function, 
// checking for the existence of a session property and using res.redirect() 
// if it's not there. If res.session.user_id does exist, it will call next(), 
// which could potentially be another middleware function or the final function that 
// will render the template.
// Used in dashboard-routes.js 
// whenever someone tries to access /dashboard without
// being logged in, we just redirect them to the login page.
const withAuth = (req, res, next) => {
    if (!req.session.user_id) {
      res.redirect('/login');
    } else {
      next();
    }
};
  
module.exports = withAuth;