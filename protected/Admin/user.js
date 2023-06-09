document.addEventListener('DOMContentLoaded', () => {
  // Function to retrieve messages from the server and display them in the table
  function fetchMessages() {
    fetch('/userName')
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error('Failed to fetch user data');
      })
      .then((messages) => {
        const tableBody = document.querySelector('table tbody');
        tableBody.innerHTML = '';

        messages.forEach((user) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${user.user_name}</td>
            <td>
              <button class="button button1" type="button" data-user-name="${user.user_name}">Remove</button>
              <button class="button button2" type="button" data-user-name="${user.user_name}">Set to admin</button>
            </td>
          `;

          tableBody.appendChild(row);
        });

        // Add event listeners to each button
        const removeButtons = document.querySelectorAll('.button1');
        removeButtons.forEach((button) => {
          button.addEventListener('click', () => {
            const user_name = button.dataset.userName;
            removeUser(user_name);
          });
        });

        const setButtons = document.querySelectorAll('.button2');
        setButtons.forEach((button) => {
          button.addEventListener('click', () => {
            const user_name = button.dataset.userName;
            setAdmin(user_name);
          });
        });
      })
      .catch(function(error) {
        console.log('Error:', error);
        // Handle error
        alert('Error'); // Show error alert
      });
  }
  fetchMessages();
  // Handle button 1 click event
  function removeUser(user_name) {
    // Send a POST request to the server
    fetch('/userRemove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_name: user_name })
    })
      .then(function(response) {
        if (response.status === 200) {
          console.log('Remove Successfully');
          // Perform any other actions after successful removal
          alert('Remove Successfully!'); // Show success alert
          fetchMessages();
        } else if (response.status === 404) {
          console.log('Member does not exist');
          // Perform any other actions after failed removal
          alert('Member does not exist!'); // Show failure alert
        } else {
          console.log('Failed to remove');
          // Perform any other actions after failed removal
          alert('An error occurred!'); // Show error alert
        }
      })
      .catch(function(error) {
        console.log('Error:', error);
        // Handle error
        alert('Error'); // Show error alert
      });
  }

  // Handle button 2 click event
  function setAdmin(user_name) {
    // Send a POST request to the server
    fetch('/setAdmin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_name: user_name })
    })
      .then(function(response) {
        if (response.status === 200) {
          console.log('Set Successfully');
          // Perform any other actions after successful set
          alert('Set Successfully!'); // Show success alert
          fetchMessages();
        } else if (response.status === 404) {
          console.log('Member does not exist');
          // Perform any other actions after failed set
          alert('Member does not exist!'); // Show failure alert
        } else {
          console.log('Failed to set');
          // Perform any other actions after failed set
          alert('An error occurred!'); // Show error alert
        }
      })
      .catch(function(error) {
        console.log('Error:', error);
        // Handle error
        alert('Error'); // Show error alert
      });
  }

});

const style = document.createElement('style');
style.innerHTML = `table {
width: 100%}
table,th, td
{
    border: 1px;
}`;
document.head.appendChild(style);
