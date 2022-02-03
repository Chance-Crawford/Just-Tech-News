// see google docs, handlebars.js, create a single post page
// frontend javascript that allows a user to upvote on
// a post in single-post.handlebars

// add an event listener to the button and 
// then make a fetch() request to the /api/posts/upvote endpoint.

async function upvoteClickHandler(event) {
    event.preventDefault();
  
    // the url to the single post page has the post_id, which we need
    // in order to make a new upvote.
    // to get the post id from the url, we split the url string at /
    // and then grab the last item in the array.
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    
    // sends PUT request to controllers/api/post-routes.js
    // to create a new Vote which is a vote table row/object that 
    // houses the post_id of the post that was voted on, 
    // and the user_id of who voted on it.
    // the response returned back by the request is stored in the variable.
    const response = await fetch('/api/posts/upvote', {
        method: 'PUT',
        body: JSON.stringify({
          post_id: id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
    });
    
    // if response was successful, reload the page.
    // else send an error.
    if (response.ok) {
        document.location.reload();
    } else {
        alert(response.statusText);
    }
}

// listener for when a user clicks the upvote button
document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);