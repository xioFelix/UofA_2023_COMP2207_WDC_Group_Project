const password = document.getElementById('password');
const anniu = document.getElementById('conceal');
anniu.addEventListener('click', function () {
    if (password.type === 'password') {
        password.setAttribute('type', 'text');
    } else {
        password.setAttribute('type', 'password');
    }
});

// eslint-disable-next-line no-unused-vars
function openClubUser() {
    window.location.href = 'clubs_user.html';
}

// eslint-disable-next-line no-unused-vars
function openClubAll() {
    window.location.href = 'club_all.html';
}


// databsases
document.addEventListener('DOMContentLoaded', () => {
    function fetchActors() {
        fetch('/actors')
            .then((response) => response.json())
            .then((data) => {
                const tableBody = document.querySelector('table tbody');
                tableBody.innerHTML = '';

                data.forEach((survival) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td>${survival.Field}</td><td>${survival.last_name}</td>`;
                    tableBody.appendChild(row);
                });
            });
    }

    fetchActors();

    const addActorForm = document.querySelector('form');

    // eslint-disable-next-line no-shadow
    addActorForm.addEventListener('submit', (addActorForm) => {
        addActorForm.preventDefault();

        const firstNameInput = document.querySelector('#actor-first-name');
        const lastNameInput = document.querySelector('#actor-last-name');

        const actor = {
            first_name: firstNameInput.value,
            last_name: lastNameInput.value
        };

        fetch('/actors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(actor)
        })
            .then((response) => response.json())
            .then((data) => {

                // eslint-disable-next-line no-console
                console.log(data);
            });

        firstNameInput.value = '';
        lastNameInput.value = '';
        fetchActors();
    });
});
