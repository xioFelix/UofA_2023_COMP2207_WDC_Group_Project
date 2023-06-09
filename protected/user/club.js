// eslint-disable-next-line no-unused-vars
function openClubUser() {
  window.location.href = 'clubs_user.html';
}

// eslint-disable-next-line no-unused-vars
function openClubAll() {
  window.location.href = 'club_all.html';
}

// club_your
// Retrieve the stored list of joined clubs
// Join the club localStorage and dynamically create club links.
// Get the button element
// Click event of yourClubsButton

// Assume you have a div element with the id "clubLinksContainer" for containing club links
const clubLinksContainer = document.getElementById('clubLink');
// Make an asynchronous request to get the joined club links
fetch('/clubs_user') // Replace YOUR_USER_ID with the actual user ID

  .then((response) => response.text())
  .then((data) => {
    // Insert the returned data into the clubLinksContainer element on the page
    clubLinksContainer.innerHTML = data;
  })
  .catch((error) => {
    console.error(error);
  });
