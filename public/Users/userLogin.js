// Main interface loading
$(document).ready(function () {
    $('#horizontalTab').easyResponsiveTabs({
        type: 'default',
        width: 'auto',
        fit: true
    });
});

function login() {

    let logindata = {
        username: document.getElementById('login-user').value,
        password: document.getElementById('login-pass').value
    };

    let req = new XMLHttpRequest();

    req.onreadystatechange = function(){
        if(req.readyState == 4 && req.status == 200){
            alert('Logged In successfully');
            window.location.href = 'http://localhost:8080/Users/user/home_page.html';
        } else if(req.readyState == 4 && req.status == 401){
            alert('Login FAILED');
        }
    };

    req.open('POST','/login');
    req.setRequestHeader('Content-Type','application/json');
    req.send(JSON.stringify(logindata));

}

// JavaScript function to handle signup
function signup() {
    const username = document.getElementById('signup-user').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-pass').value;

    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/signup', true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  // Set up a callback function to handle the response
  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log('Signup successful');
      // Show a success message in a popup or any other desired action
      alert('Signup successful!');
    } else if (xhr.status === 401) {
      console.log('Username already exists');
      // Show an error message indicating that the username already exists
      alert('Username already exists. Please choose a different username.');
    } else {
      console.log('Signup failed');
      // Show an error message indicating that the signup process failed
      alert('Signup failed. Please try again later.');
    }
  };

  // Create a data object with the form values
    const data = JSON.stringify({username: username, email: email, password: password, user: "user"});

    // Send the POST request
  xhr.send(data);
}




function logout() {

    let req = new XMLHttpRequest();

    req.onreadystatechange = function(){
        if(req.readyState == 4 && req.status == 200){
            alert('Logged Out');
        } else if(req.readyState == 4 && req.status == 403){
            alert('Not logged in');
        }
    };

    req.open('POST','/logout');
    req.send();

}

function do_google_login(response) {
    // 发送ID Token到服务器
    const req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            if (req.status == 200) {
                alert('Logged In with Google successfully');
                window.location.href = '/Users/user/home_page.html';
            } else if (req.status == 401) {
                alert('Login FAILED');
            }
        }
    };
    req.open('POST', '/google_login');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({ idToken: response.credential }));
}
