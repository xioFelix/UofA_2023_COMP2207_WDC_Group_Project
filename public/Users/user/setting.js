var password = document.getElementById('password');
var anniu = document.getElementById('conceal');
anniu.addEventListener('click', function () {
    if (password.type === 'password') {
        password.setAttribute('type', 'text');
    }
    else {
        password.setAttribute('type', 'password');
    }
});

function openClubUser() {
    window.location.href = 'clubs_user.html';
}

function openClubAll() {
    window.location.href = 'club_all.html';
}
