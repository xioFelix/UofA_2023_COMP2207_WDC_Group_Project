function fetchMessages() {
    fetch(`/activity`)
        .then(response => response.json())
        .then(messages => {
            const tableBody = document.querySelector('table tbody');
            tableBody.innerHTML = '';

            messages.forEach(activity => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div class="tabs">
                            <div class="tab">
                                <input type="checkbox" id="chck-${activity.activity_id}">
                                <label class="tab-label" for="chck-${activity.activity_id}">
                                    ${activity.announcement_title}
                                </label>
                                <div class="tab-content">
                                    <table>
                                        <tbody id="userTable-${activity.activity_id}"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </td>
                `;

                const userTableBody = row.querySelector(`#userTable-${activity.activity_id}`);
                userTableBody.innerHTML = '';

                fetch(`/activity_user/${activity.activity_id}`)
                    .then(response => response.json())
                    .then(users => {
                        users.forEach(user => {
                            const userRow = document.createElement('tr');
                            userRow.innerHTML = `
                                <td>${user.user_name}</td>
                            `;
                            userTableBody.appendChild(userRow);
                        });
                    });

                tableBody.appendChild(row);
            });
        });
}

fetchMessages();


  // Adding CSS styles
  const style = document.createElement('style');
  style.innerHTML = `
  .tabs {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 4px -2px rgba(0, 0, 0, 0.5);
}

  .tab {
    width: 100%;
    color: white;
    overflow: hidden;
}

.tab-label {
    display: flex;
    justify-content: space-between;
    padding: 1em;
    background: #374e53;
    font-weight: bold;
    cursor: pointer;
}

.tab-label:hover {
    background: #7ba1a8;
}

.tab-label::after {
    content: "❯";
    width: 1em;
    height: 1em;
    text-align: center;
    transition: all 0.35s;
}

.tab-content {
    max-height: 0;
    padding: 0 1em;
    color: #374e53;
    background: white;
    transition: all 0.35s;
}

.tab-close {
    display: flex;
    justify-content: flex-end;
    padding: 1em;
    font-size: 0.75em;
    background: #7ba1a8;
    cursor: pointer;
}

.tab-close:hover {
    background: #374e53;
}

input {
    position: absolute;
    opacity: 0;
    z-index: -1;
}

input:checked+.tab-label {
    background: #7ba1a8;
}

input:checked+.tab-label::after {
    transform: rotate(90deg);
}

input:checked~.tab-content {
    max-height: 100vh;
    padding: 1em;
}
  `;

document.head.appendChild(style);
