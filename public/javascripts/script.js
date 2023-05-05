var container = document.querySelector('.container');
var btn = document.querySelector('button');
var btn2 = document.querySelector('.show');
var headings = document.querySelectorAll('.portf h2,.portf h3');
var anchor = document.querySelectorAll('.menu a');
var spany = document.querySelectorAll('.show span');
btn.addEventListener('click', function () {
    if (this.textContent === 'Light') {
        container.classList.add('light');
        this.textContent = 'Dark';
        this.classList.add('light');
    } else {
        container.classList.remove('light');
        this.textContent = 'Light';
        this.classList.remove('light');
    }

}, false);
btn2.addEventListener('click', function () {
    spany.forEach(function (item) {
        return item.classList.toggle('show-icon');
    });
    container.classList.toggle('wide');
    anchor.forEach(function (item2) {
        return item2.classList.toggle('show-anchor');
    });
    headings.forEach(function (item3) {
        return item3.classList.toggle('big-font');
    });
}, false);
