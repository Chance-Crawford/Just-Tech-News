// see google docs, handlebars.js
// frontend javascript for capturing user input data from the login page.

// Async/await acts as "syntactic sugar" for our code, much like ES6 classes, 
// and help make our Promises more readable. To help asynchronous code use 
// async/await, we first add the keyword async to the function that wraps 
// our asynchronous code.
async function signupFormHandler(event) {
    // prevent submit event from refreshing the page.
    event.preventDefault();
  
    // Now we need to POST the username, email, and 
    // password from the form to our server, so go ahead and grab the data from the form.
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    // make a fetch() POST request to the /api/users/ to add the user to the database.
    // make sure that all fields have values before making the POST request with the "if"
    // statement.
    if (username && email && password) {
        // To use await, we'll just add the await keyword before the Promise
        // (or any asynchronous code) When using await, we can assign the 
        // result of the promise to a variable. This way, we don't need to 
        // use catch() or then() to tell the code what to do after the Promise completes.
        const response = await fetch('/api/users', {
        method: 'post',
        body: JSON.stringify({
            username,
            email,
            password
        }),
        headers: { 'Content-Type': 'application/json' }
        });

        // we do not need to put this in a "then" function because
        // await already waits for the async function to complete.
        // log the response from the database POST route we made.
        // We can use the response sent back to check if response.ok
        console.log(response);

        // check the response status
        if (response.ok) {
            console.log('success');
            // if user was created successfully, logs them in/creates a session,
            // then take them to the user dashboard page.
            document.location.replace('/dashboard');
        } else {
            // if not successful response sent back from database.
            // then alert an error.
            alert(response.statusText);
        }
    }
}

// for users that have an account and are logging in. Uses the
// user login POST route defined in controllers/api/user-routes.js
async function loginFormHandler(event) {
    event.preventDefault();
  
    // select account info from user input 
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    // if there are values entered into the input bars, make the request.
    // Uses async/await feature defined above.
    if (email && password) {
      const response = await fetch('/api/users/login', {
        method: 'post',
        body: JSON.stringify({
          email,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      // if user login successfully authenticated. go back to the homepage.
      if (response.ok) {
          // if user was logged in successfully, create a session
          // and take them to the user dashboard page.
          document.location.replace('/dashboard');
      } else {
        alert(response.statusText);
      }
    }
  }
  

// listeners
document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
document.querySelector('.login-form').addEventListener('submit', loginFormHandler);