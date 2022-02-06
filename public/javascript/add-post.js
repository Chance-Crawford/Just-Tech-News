// see google docs, handlebars.js, Building a dashboard for logged in users.

// file that the user dashboard uses to create new posts.
// captures user form input and adds the post to the database.

async function newFormHandler(event) {
    event.preventDefault();
  
    // capture user input for post
    const title = document.querySelector('input[name="post-title"]').value;
    const post_url = document.querySelector('input[name="post-url"]').value;
  
    // make post request with the user input
    const response = await fetch(`/api/posts`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        post_url
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    // if new post was successfully added to the database, refresh the user dashboard page.
    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText);
    }
}
  
  document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);