// see google docs, ORM - Notes, API routes for the user model
// We're using an Express.js router again to help us keep the routes organized.
const router = require('express').Router();
const { User } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method
    // We're finally tying it all together! We just set up the API endpoint 
    // so that when the client makes a GET request to /api/users, we will select 
    // all users from the user table in the database and send it back as JSON.
    // As mentioned before, the User model inherits functionality from the Sequelize 
    // Model class. .findAll() is one of the Model class's methods. The 
    // .findAll() method lets us query all of the users from the user table in 
    // the database, and is the JavaScript equivalent of the following SQL query:
    // SELECT * FROM users;
    // When you performed the GET requests, you might have noticed that the 
    // passwords for each user is returning as well. That's probably not the 
    // best idea, as there's no logical reason the client needs to receive a 
    // user's password. Let's update the GET routes to not return password data.
    // To do that we use attributes: { exclude: ['password'] }.
    // Sequelize is a JavaScript Promise-based library, meaning we get to 
    // use .then() with all of the model methods!
    User.findAll({
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET /api/users/1
// only returns one user based on its req.params.id value
router.get('/:id', (req, res) => {
    // much like SELECT * FROM users WHERE id = 1
    // only gets one user based on the id number
    // provided in req.params.id
    User.findOne({
        // property of sequelize model, do not return the users password
        attributes: { exclude: ['password'] },
        // gets the user by id
        where: {
          id: req.params.id
        }
    })
    // On the data returned from the database on that one user as an object
    .then(dbUserData => {
        // if user doesnt exist or has been deleted
        if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
        }
        // send the json of that user from the table as an object
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/users
// Next, add the capability to use the POST route to create a user.
router.post('/', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    // To insert data, we can use Sequelize's .create() method. Pass in 
    // key/value pairs where the keys are what we defined in the User model and the 
    // values are what we get from req.body. In SQL, this command would look like 
    // the following code:
    // INSERT INTO users
    // (username, email, password)
    // VALUES
    // ("Lernantino", "lernantino@gmail.com", "password1234");
    User.create({
        username: req.body.username,
        email: req.body.email,
        // this password gets hashed for security before getting
        // saved in the database. see User.js
        password: req.body.password
    })
    // sends back response from database as json to front end
    // if the developers want to access it to see the affectedRows or 
    // some other property
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


// see google docs, ORM - Notes, 
// User authentication log in route after password was hashed.
// Creating a log in route for the user that authenticates
// them even after their password was hashed and stored in the database.
// In this case, a login route could've used the GET method since it 
// doesn't actually create or insert anything into the database. 
// But there is a reason why a POST is the standard for the login 
// that's in process.
// A GET method carries the request parameter appended in the URL 
// string, whereas a POST method carries the request parameter in 
// req.body, which makes it a more secure way of transferring data 
// from the client to the server. Remember, the password is still 
// in plaintext, which makes this transmission process a vulnerable 
// link in the chain.
router.post('/login', (req, res) => {

    // expects {email: 'lernantino@gmail.com', password: 'password1234'}
    // In the database, find a user in the user table.
    User.findOne({
        // where the email sent in the req.body matches with an
        // email of the user in the database, 
        // (since email is unique and there can only be one user with it)
        where: {
            email: req.body.email
        }
    })
    // then return that users data so we can verify the password
    .then(dbUserData => {
        // user not found? send error message back to front end (client).
        if (!dbUserData) {
        res.status(400).json({ message: 'No user with that email address!' });
        return;
        }
        // if user exists and we found them successfully,
        // send the user data back to the front end
        // res.json({ user: dbUserData });

        // Then verify the user's password
        // by matching the password from the user and the 
        // hashed password in the database. This will be done using
        // the User instance method defined in User.js 
        // (which that method utilizes bcrypt 
        // sync function to check the plain password against
        // the hashed version)
        // If the query result is successful (i.e., not empty), we can 
        // call .checkPassword(), which will be on the dbUserData User object.
        // The .compareSync() method, which is inside the .checkPassword() 
        // method, can then confirm or deny that the supplied password matches 
        // the hashed password stored on the object. .checkPassword() will 
        // then return true on success or false on failure. We'll store that 
        // boolean value to the variable validPassword.
        // Note that the instance method was called on the user 
        // retrieved from the database, dbUserData
        const validPassword = dbUserData.checkPassword(req.body.password);

        // Because the instance method returns a Boolean, we can use it 
        // in a conditional statement to verify whether the user has been 
        // verified or not.
        // if the match returns a false value, an error message is sent back 
        // to the client, and the return statement exits out of the 
        // function immediately.
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }
          
        // However, if there is a match, the conditional statement block 
        // is ignored, and a response with the data and the message 
        // "You are now logged in." is sent instead.
        res.json({ user: dbUserData, message: 'You are now logged in!' });

    });
  
})



// PUT /api/users/1
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

    // if req.body has exact key/value pairs to match the model, 
    // you can just use `req.body` instead.
    // This .update() method combines the parameters for creating data and 
    // looking up data. We pass in req.body to provide the new data we want 
    // to use in the update and req.params.id to indicate where exactly we want 
    // that new data to be used.
    // The associated SQL syntax would look like the following code:
    // UPDATE users
    // SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234"
    // WHERE id = 1;
    // req.body would be an object matching the properties to create a user, 
    // the req.body can be a object changing all properties of the user
    // or just one. such as { password: "pass" }, we are then using
    // the properties to update a user at the specific id.
    User.update(req.body, {
        // see User.js User.init hooks
        // if password is updated to a new password, the
        // password will be hashed before being stored safely in the 
        // database.
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        // if user doesnt exist or was deleted from the database
        if (!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        // return object from database with affectedRows etc. as the response
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE /api/users/1
// to delete a user from the database
router.delete('/:id', (req, res) => {
    // squelize method that deletes user at id given in req.params.id
    // from the database.
    // To delete data, use the .destroy() method and provide some type 
    // of identifier to indicate where exactly we would like to delete 
    // data from the user database table.
    User.destroy({
        where: {
          id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;