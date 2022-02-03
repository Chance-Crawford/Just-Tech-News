// see google docs, handlebars.js, create a single post page
// frontend javascript that allows a user to create a new comment on
// a post in single-post.handlebars

async function commentFormHandler(event) {
    event.preventDefault();
  
    // get user input from comment box
    const comment_text = document.querySelector('textarea[name="comment-body"]').value.trim();
  
    // the url to the single post page has the post_id, which we need
    // in order to make a new comment.
    // to get the post id from the url, we split the url string at /
    // and then grab the last item in the array.
    const post_id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
  
    // make sure there was text entered into the comment box by the user
    if (comment_text) {
        // make POST request to controllers/api/comments route. Defined in the
        // api/comment-routes.js file.
        // store response from the request in the variable
        const response = await fetch('/api/comments', {
          method: 'POST',
          body: JSON.stringify({
            post_id,
            comment_text
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      
        // if new comment was made and added to the database successfully,
        // then reload the page to show the comment.
        if (response.ok) {
          document.location.reload();
        } else {
          alert(response.statusText);
        }
    }
}
  
// listen for add comment button
document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);