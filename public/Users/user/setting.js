var password = document.getElementById('password');
var anniu = document.getElementById('conceal');
   anniu.addEventListener('click',function(){
        if(password.type==='password')
        {
            password.setAttribute('type','text');
        }
        else
        {
            password.setAttribute('type','password');
        }
    })