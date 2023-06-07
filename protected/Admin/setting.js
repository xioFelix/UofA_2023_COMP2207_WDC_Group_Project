const password = document.getElementById('password');
const anniu = document.getElementById('conceal');
anniu.addEventListener('click', function () {
    if (password.type === 'password') {
        password.setAttribute('type', 'text');
    }else {
        password.setAttribute('type', 'password');
    }
});
