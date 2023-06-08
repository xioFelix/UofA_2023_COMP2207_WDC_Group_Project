document.addEventListener('DOMContentLoaded', () => {
  // Function to retrieve posts from the server and display them in the table
  function fetchposts() {
    fetch('/posts')
      .then(response => response.json())
      .then(posts => {
        const tableBody = document.querySelector('table tbody');
        tableBody.innerHTML = '';

        posts.forEach(activity => {
          const row = document.createElement('div');
          row.innerHTML = `
          <div class="content">
          <p id="id">Activity ID: ${activity.activity_id} Time: ${activity.post_time}</p >
          <p class="title">Title: ${activity.announcement_title}</p >
          <p class="title">Content: </p >
          <div>${activity.announcement_content}</div>
          <br>
          </div>
          <hr>
          `;

          tableBody.appendChild(row);
        });
      });
  };

  // Function to add an post to the server and update the table
  var addpost = () => {
    const clubIdInput = document.getElementById('club-id');
    const titleInput = document.getElementById('post-title');
    const contentInput = document.getElementById('post-content');

    const clubID = clubIdInput.value.trim();
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (clubID === '' || title === '' || content === '') {
      alert('Please enter clubID Title and Content.');
      return;
    }

    const post = { clubID, title, content };

    fetch('/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    })
      .then(response => {
        if (response.ok) {
          // Clear the input fields
          clubIdInput.value = '';
          titleInput.value = '';
          contentInput.value = '';

          // Update the table by retrieving all posts again
          fetchposts();
        } else if (response.status === 400) {
          return response.text();
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
  };

  // Add event listener for the Add button
  const addButton = document.getElementById('addButton');
  addButton.addEventListener('click', addpost);

  // Initial retrieval and display of posts
  fetchposts();
});