
function renderPost(post_data) {

    /*
    We're trying to create HTML that looks like:

    <div class="post">

                <div class="votes">
                    <button type="button">+</button>
                    <p><span class="count">123</span><br />votes</p>
                    <button type="button">-</button>
                </div>
                <div class="content">
                    <h3><a href="post">This is a post</a></h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur maximus, lorem non varius consequat, ipsum magna vestibulum lectus, et fringilla tellus augue id nisl. Donec tempus est a hendrerit ornare. Phasellus blandit est in malesuada interdum. Mauris finibus vehicula turpis vel lobortis. Phasellus tempor elit massa. Morbi vulputate leo a neque mollis varius. Donec ultricies aliquam vulputate. Nunc dapibus lectus a risus rutrum pulvinar.</p>
                    <div class="tags"><span class="tag">Tag1</span><span class="tag">Tag2</span><span class="date">Date blah</span></div>
                </div>

            </div>
    */

    // Start by creating elements
    let post_div = document.createElement('DIV');
    let vote_div = document.createElement('DIV');
    let content_div = document.createElement('DIV');

    post_div.classList.add("post");
    vote_div.classList.add("votes");
    content_div.classList.add("content");

    let button_upvote = document.createElement('BUTTON');
    let button_downvote = document.createElement('BUTTON');

    button_upvote.innerText = '+';
    button_upvote.type = 'button';
    button_downvote.innerText = '-';
    button_downvote.type = 'button';

    let upvote_para = document.createElement('P');
    let upvote_span = document.createElement('SPAN');
    let upvote_br = document.createElement('BR');
    let upvote_para_text = document.createTextNode('votes');

    upvote_span.classList.add('count');
    upvote_span.innerText = post_data.upvotes; // Number of upvotes

    let post_content_h = document.createElement('H3');
    let post_content_h_a = document.createElement('A');
    let post_content_p = document.createElement('P');

    post_content_h_a.href = post_data.url; // Link to post
    post_content_h_a.innerText = post_data.title; // Get post title from text input on page

    post_content_p.innerText = post_data.content; // Get post content from object

    let post_content_tags = document.createElement('DIV');
    let post_content_date = document.createElement('SPAN');

    post_content_date.classList.add('date');

    post_content_date.innerText = (new Date(post_data.timestamp)).toLocaleString();

    // Link elements together into DOM heirachy
    post_div.appendChild(vote_div);
    post_div.appendChild(content_div);

    vote_div.appendChild(button_upvote);
    vote_div.appendChild(upvote_para);
    vote_div.appendChild(button_downvote);

    upvote_para.appendChild(upvote_span);
    upvote_para.appendChild(upvote_br);
    upvote_para.appendChild(upvote_para_text);

    content_div.appendChild(post_content_h);
    content_div.appendChild(post_content_p);
    content_div.appendChild(post_content_tags);

    post_content_h.appendChild(post_content_h_a);

    // generate tags
    let taglist = post_data.tags;
    for (let t of taglist) {
        let tag = document.createElement('SPAN'); // Create a span for each tag in list/array
        tag.innerText = t;
        tag.classList.add('tag');
        post_content_tags.appendChild(tag); // Add to the tags div
    }
    post_content_tags.appendChild(post_content_date);

    // Insert into page
    document.querySelector('main').appendChild(post_div);

}

function getPost() {

    let req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            let posts = JSON.parse(req.responseText);
            for (let post of posts) {
                renderPost(post);
            }
        }
    };

    req.open('GET', '/users/posts.json');
    req.send();

}

function newPost() {

    let postdata = {
        title: document.getElementById('post-title').value,
        content: document.getElementById('post-content').value,
        tags: document.getElementById('post-tags').value.split(' ')
    };

    let req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            alert('Posted successfully');
        } else if (req.readyState == 4 && req.status == 403) {
            alert('Not logged in');
        }
    };

    req.open('POST', '/users/newpost');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(postdata));

}


function login() {

    let logindata = {
        username: document.getElementById('login-user').value,
        password: document.getElementById('login-pass').value
    };

    let req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            alert('Logged In successfully');
        } else if (req.readyState == 4 && req.status == 401) {
            alert('Login FAILED');
        }
    };

    req.open('POST', '/loginToUser');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(logindata));

}

function signup() {

    let logindata = {
        username: document.getElementById('signup-user').value,
        password: document.getElementById('signup-pass').value
    };

    if (document.getElementById('signup-pass').value !== document.getElementById('signup-confirm').value) {
        alert("Passwords don't match");
        return;
    }

    let req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            alert('Signed Up successfully');
        } else if (req.readyState == 4 && req.status == 401) {
            alert('Signed Up FAILED');
        }
    };

    req.open('POST', '/signup');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(logindata));

}

function logout() {

    let req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            alert('Logged Out');
        } else if (req.readyState == 4 && req.status == 403) {
            alert('Not logged in');
        }
    };

    req.open('POST', '/logout');
    req.send();

}



function do_google_login(response) {

    // Sends the login token provided by google to the server for verification using an AJAX request

    console.log(response);

    // Setup AJAX request
    let req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        // Handle response from our server
        if (req.readyState == 4 && req.status == 200) {
            alert('Logged In with Google successfully');
        } else if (req.readyState == 4 && req.status == 401) {
            alert('Login FAILED');
        }
    };

    // Open requst
    req.open('POST', '/loginToUser');
    req.setRequestHeader('Content-Type', 'application/json');
    // Send the login token
    req.send(JSON.stringify(response));

}
