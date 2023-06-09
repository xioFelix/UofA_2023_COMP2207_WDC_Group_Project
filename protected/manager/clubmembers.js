document.addEventListener('DOMContentLoaded', () => {
    // Function to retrieve messages from the server and display them in the table
    function fetchMessages() {
        fetch('/clubmembersName')
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
                <button class="button" type="button" data-user-name="${user.user_name}">Remove</button>
              </td>
            `;
                    tableBody.appendChild(row);
                });

                // Add event listeners to each button
                const removeButtons = document.querySelectorAll('.button');
                removeButtons.forEach((button) => {
                    button.addEventListener('click', () => {
                        const user_name = button.dataset.userName;
                        removeClubmembers(user_name);
                    });
                });
            })
            .catch(function (error) {
                console.log('Error:', error);
                // Handle error
                alert('Error'); // Show error alert
            });
    }

    fetchMessages();

    // Handle button click event
    function removeClubmembers(user_name) {
        // Send a POST request to the server
        fetch('/clubmembersRemove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_name: user_name })
        })
            .then(function (response) {
                if (response.status === 200) {
                    console.log('Remove Successfully');
                    // Perform any other actions after successful removal
                    alert('Remove Successfully!'); // Show success alert
                    fetchMessages();
                } else if (response.status === 404) {
                    console.log('Admin does not exist');
                    // Perform any other actions after failed removal
                    alert('Member does not exist!'); // Show failure alert
                } else {
                    console.log('Failed to remove');
                    // Perform any other actions after failed removal
                    alert('An error occurred!'); // Show error alert
                }
            })
            .catch(function (error) {
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