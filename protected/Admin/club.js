document.addEventListener('DOMContentLoaded', () => {
  // Function to retrieve messages from the server and display them in the table
  function fetchMessages() {
    fetch('/clubName')
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error('Failed to fetch user data');
      })
      .then((messages) => {
        const tableBody = document.querySelector('table tbody');
        tableBody.innerHTML = '';

        messages.forEach((club) => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${club.club_name} club</td>
              <td>
                <button class="button" type="button" data-club-name="${club.club_name}">Remove</button>
              </td>
          `;
          tableBody.appendChild(row);
        });

        // Handle button click event
        function removeClub(club_name) {
          // Send a POST request to the server
          fetch('/clubRemove', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ club_name: club_name })
          })
              .then(function(response) {
                if (response.status === 200) {
                  console.log('Remove Successfully');
                  // Perform any other actions after successful removal
                  alert('Remove Successfully!'); // Show success alert
                  fetchMessages();
                } else if (response.status === 404) {
                  console.log('Club does not exist');
                  // Perform any other actions after failed removal
                  alert('Club does not exist!'); // Show failure alert
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
        // Add event listeners to each button
        const removeButtons = document.querySelectorAll('.button');
        removeButtons.forEach((button) => {
          button.addEventListener('click', () => {
            const club_name = button.dataset.clubName;
            removeClub(club_name);
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
});

const style = document.createElement('style');
style.innerHTML = `table {
width: 100%}
table,th, td
{
    border: 1px;
}`;

document.head.appendChild(style);
