// Toggle password visibility
document.getElementById('togglePassword').addEventListener('click', function () {
  var passwordInput = document.getElementById('password');
  if (passwordInput.type === 'password') {
    passwordInput.setAttribute('type', 'text');
  } else {
    passwordInput.setAttribute('type', 'password');
  }
});

document.querySelector('form').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the form's default submission behavior

  // Get the values of the form fields
  var username = document.getElementById('username').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  // Create an object to store the data to be sent
  var data = {
    username: username,
    email: email,
    password: password
  };

  // Send POST request to the server
  fetch('/personal_info_man', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(function (response) {
      if (response.ok) {
        console.log('Update successful');
        // Perform any other operations after success here
        alert('Update successful'); // Display success alert
      } else {
        console.log('Update failed');
        // Perform any other operations after failure here
        alert('Update failed'); // Display failure alert
      }
    })
    .catch(function (error) {
      console.log('Error:', error);
      // Handle the error here
      alert('An error occurred'); // Display error alert
    });
});
