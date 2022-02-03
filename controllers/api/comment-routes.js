// see google docs, ORM - Notes, API routes for the user model
// We're using an Express.js router again to help us keep the routes organized.
// ALSO see user-routes.js for more comments
const router = require('express').Router();
const { Comment } = require('../../models');


// get all comments
router.get('/', (req, res) => {
    Comment.findAll({

    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// endpoint to create a comment
router.post('/', (req, res) => {
    // check if a user is logged in by checking if there is a session.
    // see post-routes.js PUT /upvote for more comments.
    if (req.session) {
        // create a comment if there is a session.
        Comment.create({
        comment_text: req.body.comment_text,
        post_id: req.body.post_id,
        // use the id that is stored in the session.
        user_id: req.session.user_id
        })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    }
});


// delete a comment from the database based on it's id
router.delete('/:id', (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentData => {
        if(!dbCommentData){
            res.status(404).json({ message: 'No comment found with this id' });
            return;
        }
        res.json(dbCommentData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;