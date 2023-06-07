// First Club
var modal1 = document.getElementById("myModal1");
var btn1 = document.getElementById("myBtn1");
var span1 = document.querySelector('.close1');
btn1.onclick = function() {
    modal1.style.display = "block";
};
span1.onclick = function() {
    modal1.style.display = "none";
};
window.onclick = function(event) {
    if (event.target === modal1) {
        modal1.style.display = "none";
    }
};


// Second Club
var modal2 = document.getElementById("myModal2");
var btn2 = document.getElementById("myBtn2");
var span2 = document.querySelector('.close2');
btn2.onclick = function() {
    modal2.style.display = "block";
};
span2.onclick = function() {
    modal2.style.display = "none";
};
window.onclick = function(event) {
    if (event.target === modal2) {
        modal2.style.display = "none";
    }
};


// Third Club
var modal3 = document.getElementById("myModal3");
var btn3 = document.getElementById("myBtn3");
var span3 = document.querySelector('.close3');
btn3.onclick = function() {
    modal3.style.display = "block";
};
span3.onclick = function() {
    modal3.style.display = "none";
};
window.onclick = function(event) {
    if (event.target === modal3) {
        modal3.style.display = "none";
    }
};


// Forth Club
var modal4 = document.getElementById("myModal4");
var btn4 = document.getElementById("myBtn4");
var span4 = document.querySelector('.close4');
btn4.onclick = function() {
    modal4.style.display = "block";
};
span4.onclick = function() {
    modal4.style.display = "none";
};
window.onclick = function(event) {
    if (event.target === modal4) {
        modal4.style.display = "none";
    }
};
