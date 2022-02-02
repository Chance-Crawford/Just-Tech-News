// see google docs, Express-session and connect-session-sequelize
// logs out a user from the session that was created by logging in.
async function logout() {
    // POST route to destroy the session and cookies
    const response = await fetch('/api/users/logout', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' }
    });
  
    // if successful in logging out, return to the homepage.
    if (response.ok) {
      document.location.replace('/');
    } else {
      alert(response.statusText);
    }
}
  
// listens for the logout button to be clicked
document.querySelector('#logout').addEventListener('click', logout);