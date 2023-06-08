var joinButtons = document.querySelectorAll('.JoinButton');

joinButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the button's default click behavior

        // Get the ID of the club that the button belongs to
        var club_id = button.getAttribute('data-club-id');

        var user_id = '11';

        // Create an object to store the data to be sent
        var data = {
            user_id: user_id,
            club_id: club_id
        };

        // Send POST request to the server
        fetch('/joinClub', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(function (response) {
                if (response.ok) {
                    console.log('Successfully joined the club');
                    // Perform any other operations here after success
                    alert('You have successfully joined the club!'); // Show success pop-up
                } else {
                    console.log('Failed to join the club');
                    // Perform any other operations here after failure
                    alert('You are already a member of the club!'); // Show failure pop-up
                }
            })
            .catch(function (error) {
                console.log('Error:', error);
                // Handle errors here
                alert('An error occurred'); // Show error pop-up
            });
    });
});
