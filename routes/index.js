const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
// eslint-disable-next-line no-unused-vars
const session = require('express-session');
// eslint-disable-next-line no-unused-vars
require('connect-flash');
// eslint-disable-next-line no-unused-vars
const cookieParser = require('cookie-parser');
const app = express();
const CLIENT_ID = '646353834079-tcugf0r1sa6bcusb8q7a8g9fl02o7otn.apps.googleusercontent.com';
const { OAuth2Client } = require('google-auth-library');
const { join } = require("path");
const client = new OAuth2Client(CLIENT_ID);
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createPool({
  host: 'localhost',
  database: 'survival'
});

router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
  console.log("Cookies :  ", req.cookies);
});

router.get('/login', function (req, res) {
  console.log(req.session.username);
  if (req.session.username === null || req.session.username === '') {
    req.flash('info', 'Please Login First!');
    res.redirect('/Users/userLogin.html');
  } else {
    res.redirect('../protected/user/home_page.html');

  }
});

router.post('/login', async function (req, res, next) {
  try {
    // Check if the data in the request body is empty
    if (!req.body.user_email || !req.body.password) {
      res.sendStatus(400); // Return an error status code to indicate incomplete request body data
      return;
    }

    // Find a matching user in the database and retrieve their identity
    const query = 'SELECT user_id, user_name, user_email, user_password, user_identity FROM user WHERE user_email = ? AND user_password = ?';
    db.getConnection(function (err, connection) {
      if (err) {
        console.error(err);
        res.sendStatus(500); // Return a server error status code when handling errors
        return;
      }

      // eslint-disable-next-line no-shadow
      connection.query(query, [req.body.user_email, req.body.password], function (err, results) {
        connection.release(); // Release the connection
        if (err) {
          console.error(err);
          res.sendStatus(500); // Return a server error status code when handling errors
          return;
        }

        let user;
        if (results.length > 0) {
          // eslint-disable-next-line prefer-destructuring
          user = results[0];
        } else {
          console.log('No results found');
        }

        if (!user || !user.user_password) {
          res.sendStatus(401); // Return status code 401 if user_password is empty or undefined
          return;
        }

        if (user.user_password === req.body.password) {
          req.session.username = user.user_name;
          req.session.userId = user.user_id;
          req.session.userEmail = user.user_email;
          req.session.userIdentity = user.user_identity;
          console.log("The current user is2: " + req.session.username);
          // Redirect to different pages based on user identity
          if (user.user_identity === "manager") {
            res.status(201).send({ redirectUrl: '/protected/manager/home_page.html' });
          } else if (user.user_identity === "user") {
            res.status(202).send({ redirectUrl: '/protected/user/home_page.html' });
          } else if (user.user_identity === "admin") {
            res.status(203).send({ redirectUrl: '/protected/Admin/home_page.html' });
          }
        } else {
          res.sendStatus(401); // Incorrect username or password, login failed!
        }
      });
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500); // Return a server error status code when handling errors
  }
});



router.get('/get_user_info', function (req, res, next) {
  res.json({
    username: req.session.username,
    userId: req.session.userId,
    email: req.session.userEmail,
    userIdentity: req.session.userIdentity
  });
});

router.post('/signup', function (req, res, next) {
  try {
    // Verify that the data in the request body is empty
    if (!req.body.username || !req.body.email || !req.body.password) {
      res.sendStatus(400); // Return an error status code, indicating that the request body data is incomplete
      return;
    }

    // Find the same user name in the database
    const query = 'SELECT * FROM user WHERE user_name = ?';
    db.getConnection(function (err, connection) {
      if (err) {
        console.error(err);
        res.sendStatus(500); // Return server error status code when handling error
        return;
      }

      connection.query(query, [req.body.username], function (err1, results) {
        if (err1) {
          console.error(err1);
          res.sendStatus(500);
          return;
        }

        if (results.length > 0) {
          res.sendStatus(401); // The user name already exists. The unauthorized status code is returned
        } else {
          // Insert the new user into the database
          const insertQuery = 'INSERT INTO user (user_name, user_email, user_password, user_identity) VALUES (?, ?, ?, ?)';
          connection.query(insertQuery, [req.body.username, req.body.email, req.body.password, req.body.user], function (err2) {
            connection.release();

            if (err2) {
              console.error(err2);
              res.sendStatus(500);
              return;
            }

            req.session.username = req.body.username;
            console.log(req.body.username);
            res.end();
          });
        }
      });
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.get('/logout', function (req, res, next) {
  if ('username' in req.session) {
    delete req.session.username;
    res.redirect('/protected/user/userLogin.html');
    console.log("The current user is:" + req.session.username);
  } else {
    res.sendStatus(403);
    console.log("The current user is:" + req.session.username);
  }
});

router.post('/loginToManager', function (req, res) {
  res.redirect('/protected/manager/home_page.html');
});

router.post('/google_login', async function (req, res) {
  try {
    const { idToken } = req.body; // Get the Google login token provided by the client

    // Use Google OAuth2Client to authenticate the token
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: CLIENT_ID // Google client ID
    });

    const payload = ticket.getPayload();
    const userEmail = payload.email;

    // Check whether the user exists in the database
    const query = 'SELECT * FROM user WHERE user_email = ?';
    db.getConnection(function (err, connection) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }

      // eslint-disable-next-line no-shadow
      connection.query(query, [userEmail], function (err, results) {
        connection.release();

        if (err) {
          console.error(err);
          res.sendStatus(500);
          return;
        }

        const user = results[0];

        if (user) {
          req.session.username = user.user_name;
          req.session.userId = user.user_id;
          req.session.userEmail = user.user_email;
          req.session.userIdentity = user.user_identity;
          console.log("The current user is2: " + req.session.username);

          // Redirect to different pages based on user identity
          if (user.user_identity === "manager") {
            res.status(211).send({ redirectUrl: '/protected/manager/home_page.html' });
          } else if (user.user_identity === "user") {
            res.status(212).send({ redirectUrl: '/protected/user/home_page.html' });
          } else if (user.user_identity === "admin") {
            res.status(213).send({ redirectUrl: '/protected/Admin/home_page.html' });
          }
        } else {
          res.sendStatus(401); // The user does not exist. The unauthorized status code is returned
        }
      });
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});


function checkAuth(req, res, next) {
  if (!req.session.username) {
    res.status(401).send('Unauthorized');
  } else {
    next();
  }
}

app.use('/protected', checkAuth);

app.get('/protected/user/home_page.html', function (req, res) {
  res.sendFile(join(__dirname, 'user', 'home_page.html'));
});

app.get('/protected/manager/home_page.html', function (req, res) {
  res.sendFile(join(__dirname, 'manager', 'home_page.html'));
});

app.get('/protected/Admin/home_page.html', function (req, res) {
  res.sendFile(join(__dirname, 'Admin', 'home_page.html'));
});

// post annoucenment
// Route for retrieving activitys from the database
router.get('/posts', function (req, res) {

  //Connect to the database
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = "SELECT * FROM activity;";
    connection.query(query, function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); // send response
    });
  });
});

// Route for adding an activity to the database
// Modify the router.post('/posts') route to check club_id existence
router.post('/posts', (req, res) => {
  const { clubID, title, content } = req.body;

  // Connect to the database
  req.pool.getConnection((err, connection) => {
    if (err) {
      res.sendStatus(500);
      return;
    }

    // Check if club_id exists in the club table
    const checkQuery = 'SELECT * FROM club WHERE club_id = ?';
    connection.query(checkQuery, [clubID], (err2, rows) => {
      if (err2) {
        connection.release();
        res.sendStatus(500);
        return;
      }

      if (rows.length === 0) {
        connection.release();
        res.status(400).send('Club ID does not exist!');
        return;
      }

      // Club ID exists, proceed with adding the post
      const insertQuery = 'INSERT INTO activity (club_id, announcement_title, announcement_content) VALUES (?, ?, ?)';
      connection.query(insertQuery, [clubID, title, content], (err3, result) => {
        connection.release();
        if (err3) {
          res.sendStatus(500);
          return;
        }

        res.status(201).json(result);
      });
    });
  });
});

// user view the activities and join in the activities
// Route for retrieving activities from the database
router.get('/message1', function (req, res) {
  // Connect to the database
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    // get the annoucenment of web club
    var query = 'SELECT * FROM activity WHERE club_id = 1';
    connection.query(query, function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); // send response
    });
  });
});

router.get('/message2', function (req, res) {
  // Connect to the database
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    // get the annoucenment of sleeping club
    var query = 'SELECT * FROM activity WHERE club_id = 2';
    connection.query(query, function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); // send response
    });
  });
});

router.get('/message3', function (req, res) {
  // Connect to the database
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    // get the annoucenment of frisbee club
    var query = 'SELECT * FROM activity WHERE club_id = 3';
    connection.query(query, function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); // send response
    });
  });
});

router.get('/message4', function (req, res) {
  // Connect to the database
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    // get the annoucenment of eating club
    var query = 'SELECT * FROM activity WHERE club_id = 4';
    connection.query(query, function (err, rows, fields) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); // send response
    });
  });
});

// Route for joining activities from users to the database
router.post('/message', (req, res) => {
  const { userID, activityID } = req.body;

  // Connect to the database
  req.pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }

    // Check if user_id exists in the userAct table
    const checkQuery = 'SELECT * FROM userAct WHERE user_id = ? AND activity_id = ?';
    connection.query(checkQuery, [userID, activityID], (err2, rows) => {
      if (err2) {
        console.error(err2);
        connection.release();
        res.sendStatus(500);
        return;
      }
      if (rows.length > 0) {
        // The user has joined the specified club
        console.log("Already joined this activity!");
        res.sendStatus(409); // conflict
        return;
      }
      const insertQuery = 'INSERT INTO userAct (user_id, activity_id) VALUES (?, ?)';
      connection.query(insertQuery, [userID, activityID], (err3, result) => {
        if (err3) {
          if (err3.code === 'ER_DUP_ENTRY') {
            console.log('User is already a member of the club.'); // user is already the member of club
            res.sendStatus(409); // conflict
          } else {
            console.error(err3);
            res.sendStatus(500);
          }
          connection.release();
          return;
        }
        console.log("Successfully joined the activity!");
        res.sendStatus(200);
        connection.release();
      });
    });
  });
});

// users quit club
// Route for quitting clubs from users to the database
router.post('/quitClub', (req, res) => {
  const { userID, clubID } = req.body;

  // Connect to the database
  req.pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }

    // Check user_id in table userAct and delete
    const checkQuery = 'SELECT userAct.user_id, userAct.activity_id, activity.club_id FROM userAct RIGHT JOIN activity ON userAct.activity_id = activity.activity_id WHERE userAct.user_id = ?';
    connection.query(checkQuery, [userID], (err2, rows) => {
      if (err2) {
        console.error(err2);
        connection.release();
        res.sendStatus(500);
        return;
      }

      if (rows.length > 0) {
        // User has already joined the specified club
        const deleteQuery1 = 'DELETE FROM userAct WHERE activity_id IN (SELECT activity_id FROM activity WHERE club_id = ?)';
        const deleteQuery2 = 'DELETE FROM userClub WHERE user_id = ? AND club_id = ?';

        connection.query(deleteQuery1, [clubID], (err3, result) => {
          if (err3) {
            connection.release(); // Release the database connection
            console.error(err3);
            res.sendStatus(500);
            return;
          }

          connection.query(deleteQuery2, [userID, clubID], (err4, result) => {
            connection.release(); // Release the database connection

            if (err4) {
              console.error(err4);
              res.sendStatus(500);
              return;
            }

            console.log("Successfully quit the club!");
            res.sendStatus(200); // Success
          });
        });
      } else {
        console.log("User not in the club!");
        res.sendStatus(409); // Success
      }
    });
  });
});

// setting
router.post('/personal_info', function (req, res, next) {
  try {
    // Verify that the data in the request body is empty
    if (!req.body.username || !req.body.email || !req.body.password) {
      res.sendStatus(400); // Return an error status code, indicating that the request body data is incomplete
      return;
    }

    // update user information
    const updateQuery = 'UPDATE user SET user_name = ?, user_email = ?, user_password = ? WHERE user_id = 11';
    db.getConnection(function (err, connection) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }

      // eslint-disable-next-line max-len
      connection.query(updateQuery, [req.body.username, req.body.email, req.body.password], function (err) {
        connection.release();

        if (err) {
          console.error(err);
          res.sendStatus(500);
          return;
        }

        req.session.username = req.body.username;
        console.log("Successful update the information of user: " + req.body.username);
        res.end();
      });
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.get('/personal_info', function (req, res) {
  // Get the current user's information from the database
  db.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = 'SELECT * FROM user WHERE user_id = ?'; // Suppose you have a table named 'user' and a field named 'id' to identify the user
    connection.query(query, function (err, results) { // Suppose you have obtained the ID of the currentuser from the request and assigned it to the variable currentuser_id
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send response
    });
  });
});

//  club_all join
router.post('/joinClub', function (req, res) {
  const { user_id, club_id } = req.body;

  try {
    // Verify that the data in the request body is empty
    if (!user_id || !club_id) {
      res.sendStatus(400);
      return;
    }

    // Check whether the user has joined the club
    const selectQuery = 'SELECT * FROM userClub WHERE user_id = ? AND club_id = ?';
    db.query(selectQuery, [user_id, club_id], function (err, rows) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }
      if (rows.length > 0) {
        res.sendStatus(409); // conflict
        return;
      }

      // If the user does not join the specified club, insert a record
      const insertQuery = 'INSERT INTO userClub (user_id, club_id) VALUES (?, ?)';
      db.query(insertQuery, [user_id, club_id], function (err) {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            console.log('User is already a member of the club.'); // The user is already a club member
            res.sendStatus(409); // conflict
          } else {
            console.error(err);
            res.sendStatus(500);
          }
          return;
        }
        console.log(`Successfully added the club ID: ${club_id} to the user ID: ${user_id}`);
        res.sendStatus(200);
      });
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.get('/clubs_user', function (req, res) {
  const { user_id } = req.query; // Obtain the user ID from the query parameters
  const clubLinks = [
    { name: 'Web', url: './protected/user/webclub.html' },
    { name: 'Sleeping', url: './protected/user/sleepingclub.html' },
    { name: 'Frisbee', url: './protected/user/frisbee.html' },
    { name: 'Eating', url: './protected/user/eatingclub.html' }
  ];

  try {
    // Query the name of the club to which the user has joined
    const selectQuery = `
      SELECT c.club_id, c.club_name
      FROM userClub uc
      JOIN club c ON uc.club_id = c.club_id
      WHERE uc.user_id = ?`;
    db.query(selectQuery, [user_id], function (err, rows) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }

      // Extract the list of clubs that the user has joined
      const joinClub = rows.map((row) => ({
        club_id: row.club_id,
        club_name: row.club_name
      }));

      // Generate the HTML for club links based on joinedClubs
      const clubLinksHTML = joinClub
        .map((club) => {
          const clubLink = clubLinks.find((link) => link.name === club.club_name);
          if (clubLink) {
            return `<a href="${club.club_name}club.html">${club.club_name} club</a >`;
          }
          return '';
        })
        .join('<br>');
      // Return the joined club link to the client
      res.send(clubLinksHTML);
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Manager
// setting manager
router.post('/personal_info_man', function (req, res, next) {
  try {
    // Verify that the data in the request body is empty
    if (!req.body.username || !req.body.email || !req.body.password) {
      res.sendStatus(400); // Return an error status code indicating that the request body data is incomplete
      return;
    }

    // Update user information
    const updateQuery = 'UPDATE user SET user_name = ?, user_email = ?, user_password = ? WHERE user_id = 7';
    db.getConnection(function (err, connection) {
      if (err) {
        console.error(err);
        res.sendStatus(500); // Return server error status code when handling error
        return;
      }

      // eslint-disable-next-line max-len
      connection.query(updateQuery, [req.body.username, req.body.email, req.body.password], function (err) {
        connection.release(); // release connection

        if (err) {
          console.error(err);
          res.sendStatus(500); // Return server error status code when handling error
          return;
        }

        req.session.username = req.body.username;
        console.log("Successful update the information of user: " + req.body.username);
        res.end();
      });
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500); // Return server error status code when handling error
  }
});

router.get('/personal_info_man', function (req, res) {
  // Gets information about the current user from the database
  db.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500); // Return server error status code when handling error
      return;
    }
    var query = 'SELECT * FROM user WHERE user_id = ?'; // Suppose you have a table named 'user' and a field named 'id' that identifies the user
    connection.query(query, function (err, results) { // Suppose you've taken the ID of the currentuser from the request and assigned it to the variable currentuser_id

      connection.release(); // release connection
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); //send response
    });
  });
});

module.exports = router;
