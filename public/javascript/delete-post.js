// see google docs, handlebars.js, Creating an Edit Post Page.
// used in edit-post.handlebars template.
// frontend javascript that allows a user delete a post by making an api request 
// to destroy the post in the database.

// When the button is clicked, you'll need to capture the 
// id of the post and use fetch() to make a DELETE request to
// /api/posts/:id. If the request is successful, redirect the 
// user using document.location.replace('/dashboard/').
async function deleteFormHandler(event) {
    // prevent page refresh
    event.preventDefault();
  
    // capture id of the post from the url string of the page
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    // make request to delete post from the database and await the response
    // before moving on.
    const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE'
    });

    // check if delete request was successful
    if (response.ok) {
        document.location.replace('/dashboard/');
    } else {
        alert(response.statusText);
    }
}
  
// capture the click on the delete post button
document.querySelector('.delete-post-btn').addEventListener('click', deleteFormHandler);