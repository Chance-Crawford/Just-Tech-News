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
    // req.body would be an object matching the properties to create a user, we are then using
    // the properties to update a user at the specific id.
    User.update(req.body, {
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