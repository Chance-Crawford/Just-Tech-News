// see google docs, handlebars.js, Creating an Edit Post Page.
// used in edit-post.handlebars template.
// frontend javascript that allows a user edit a post by capturing
// their input and making an api request to update the post in the database.

// capture the id of the post as well as the value of the post-title form element. 
// The id will be included in the URL of the PUT request (e.g., /api/posts/${id}), 
// but the title will need to be part of the body. Remember that the body will also 
// need to be stringified.
// Send a request to the api route that updates the title of a post in the database.
async function editFormHandler(event) {
    // prevent page refresh
    event.preventDefault();
  
    // capture value input by user for new title
    const title = document.querySelector('input[name="post-title"]').value.trim();

    // capture id of the post from the url string of the page
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    // make the PUT request to change the title in the database
    // if the values arent empty or falsy.
    if(id && title){
        const response = await fetch(`/api/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
              title
            }),
            headers: {
              'Content-Type': 'application/json'
            }
        });

        // check if update title request was successful
        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
    

    
  
}
  
document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);