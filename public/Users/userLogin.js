function do_google_login(response) {

    // Sends the login token provided by google to the server for verification using an AJAX request

    console.log(response);

    // Setup AJAX request
    let req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        // Handle response from our server
        if (req.readyState == 4 && req.status == 200) {
            alert('Logged In with Google successfully');
        } else if (req.readyState == 4 && req.status == 401) {
            alert('Login FAILED');
        }
    };

    // Open requst
    req.open('POST', '/login');
    req.setRequestHeader('Content-Type', 'application/json');
    // Send the login token
    req.send(JSON.stringify(response));

}

function logout() {

    let req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            alert('Logged Out');
        } else if (req.readyState == 4 && req.status == 403) {
            alert('Not logged in');
        }
    };

    req.open('POST', '/logout');
    req.send();

}