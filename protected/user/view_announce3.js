document.addEventListener('DOMContentLoaded', () => {
  // Function to retrieve messages from the server and display them in the table
  function fetchMessages() {
    fetch('/message3')
      .then(response => response.json())
      .then(messages => {
        const tableBody = document.querySelector('table tbody');
        tableBody.innerHTML = '';

        messages.forEach(activity => {
          const row = document.createElement('div');
          row.innerHTML = `
            <div class="content">
              <p id="id">Activity ID: ${activity.activity_id} Time: ${activity.post_time}</p>
              <p class="title">Title: ${activity.announcement_title}</p>
              <p class="title">Content: </p>
              <div>${activity.announcement_content}</div>
              <br>
              <button class="postButton" id="submitButton" data-activity-id="${activity.activity_id}">Join</button>
            </div>
            <hr>
          `;

          tableBody.appendChild(row);
        });

        // Add event listeners to each post button
        const postButtons = document.querySelectorAll('.postButton');
        postButtons.forEach(button => {
          button.addEventListener('click', () => {
            const activityID = button.dataset.activityId;
            postActivity(activityID);
          });
        });
      });
  }

  // Function to post activity
  function postActivity(activityID) {
    const userID = 2; // Replace with the actual user ID
    const Activity = { userID, activityID };

    fetch('/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Activity),
    })
      .then(response => {
        if (response.ok) {
          // Update the table by retrieving all messages again
          alert("Successfully joined the activity!");
          // fetchMessages();
        } else if (response.status === 409) {
          alert("You have already joined this activity!");
          return;
        } else {
          throw new Error('An error occurred');
        }
      })
      .then(errorMessage => {
        if (errorMessage) {
          alert(errorMessage);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

var quitButton = document.querySelectorAll('.quitButton');

quitButton.forEach(function(button){
  button.addEventListener('click',function(event) {
    event.preventDefault();

    var userID = 2;
    var clubID = button.getAttribute('data-club-id');
    const quitClub = { userID, clubID };

    fetch('/quitClub', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quitClub),
    })
    .then(response => {
      if (response.ok) {
        // Update the table by retrieving all messages again
        alert("Successfully quit the club!");
        window.location.href = './clubs_user.html';
      } else {
        throw new Error('An error occurred');
      }
    })
    .catch(error => {
      console.error(error);
      alert("An error occurred");
    });
  });
});
  fetchMessages();
});
