function fetchMessages() {
    fetch(`/user_activity`)
      .then(response => response.json())
      .then(messages => {
        const tableBody = document.querySelector('table tbody');
        tableBody.innerHTML = '';
        messages.forEach(activity => {
          const row = document.createElement('div');
          row.innerHTML = `
          <div class="content">
          <p class="title">Title: ${activity.announcement_title}</p >
          <p class="title">Content: </p >
          <div>${activity.announcement_content}</div>
          <br>
          </div>
          <hr>
          `;
          tableBody.appendChild(row);
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  fetchMessages();

  const style = document.createElement('style');
  style.innerHTML = `

  `;

document.head.appendChild(style);
