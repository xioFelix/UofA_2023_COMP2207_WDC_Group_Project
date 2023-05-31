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
