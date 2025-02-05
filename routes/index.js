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
const CLIENT_ID = '75404991579-12nakh3l8ida0mseh3ff6rhrjbqjd6r4.apps.googleusercontent.com';
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


router.post('/signup', function(req, res, next) {
  try {
    // Validate if the data in the request body is empty
    if (!req.body.username || !req.body.email || !req.body.password) {
      res.sendStatus(400); // Return error status code indicating incomplete request body data
      return;
    }

    // Check if the same username already exists in the database
    const query = 'SELECT * FROM user WHERE user_name = ?';
    db.getConnection(function(err, connection) {
      if (err) {
        console.error(err);
        res.sendStatus(500); // Return server error status code when handling errors
        return;
      }

      connection.query(query, [req.body.username], function(err1, results) {
        if (err1) {
          console.error(err1);
          res.sendStatus(500); // Return server error status code when handling errors
          return;
        }

        if (results.length > 0) {
          res.sendStatus(401); // Username already exists, return unauthorized status code
        } else {
          // Insert the new user into the database
          const insertQuery = 'INSERT INTO user (user_name, user_email, user_password, user_identity) VALUES (?, ?, ?, ?)';
          connection.query(insertQuery, [req.body.username, req.body.email, req.body.password, req.body.user], function(err2) {
            connection.release(); // Release the connection

            if (err2) {
              console.error(err2);
              res.sendStatus(500); // Return server error status code when handling errors
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
    res.sendStatus(500); // Return server error status code when handling errors
  }
});



router.post('/manager_signup', function (req, res, next) {
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
          const insertUserQuery = 'INSERT INTO user (user_name, user_email, user_password, user_identity) VALUES (?, ?, ?, ?)';
          connection.query(insertUserQuery, [req.body.username, req.body.email, req.body.password, req.body.user], function (err2, userResult) {
            if (err2) {
              console.error(err2);
              res.sendStatus(500);
              return;
            }

            // Insert the new user into the manager table
            const insertManagerQuery = 'INSERT INTO manager (user_id, club_id) VALUES (?, ?)';
            const userId = userResult.insertId; // Get the user_id just inserted into the user table
            const clubId = req.body.club; // Get the club_id from the HTML radio button
            connection.query(insertManagerQuery, [userId, clubId], function (err3) {
              if (err3) {
                console.error(err3);
                res.sendStatus(500);
                return;
              }

              req.session.username = req.body.username;
              console.log(req.body.username);
              res.end();
            });
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
  const { userId } = req.session;

  // Connect to the database
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    var query = 'SELECT club_id FROM manager WHERE user_id = ?';
    connection.query(query, [userId], function (err2, rows, fields) {
      connection.release();
      if (err2) {
        res.sendStatus(500);
        return;
      }
      if (rows.length === 0) {
        connection.release();
        res.status(400).send('no annoucenment!');
        return;
      }
      var clubId = rows[0].club_id;
      var query2 = 'SELECT * FROM activity WHERE club_id = ?';
      connection.query(query2, [clubId], function (err3, rows1) {
        connection.release();
        if (err3) {
          res.sendStatus(500);
          return;
        }
        res.json(rows1); // send response
      });
    });
  });
});

const nodemailer = require('nodemailer');
const path = require('path');
const moment = require('moment-timezone');
const sendTime = moment().tz('Australia/Adelaide').format('MMMM Do YYYY, h:mm:ss a');

const transporter = nodemailer.createTransport({
  host: 'smtp.yeah.net',
  port: 465,
  secure: true,
  auth: {
    user: 'xiofelix@yeah.net',
    pass: 'OKKUTYNRKMANYFWX'
  }
});

function sendEmailToUser(userEmail, postTitle, postContent) {
  const mailOptions = {
    from: 'xiofelix@yeah.net',
    to: userEmail,
    subject: 'New Post Notification',
    html: `
    <html>
      <head>
        <style>
          .container {
            background-color: #7ba1a8;
            padding: 20px;
            font-family: Arial, sans-serif;
          }
          .title {
            font-size: 22px;
            font-weight: bold;
            color: #333333;
          }
          .content {
            font-size: 18px;
            color: #F5F5F5;
            margin-top: 10px;
          }
          .sent-time {
            font-size: 16px;
            color: #E7E7E7;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <p class="title">${postTitle}</p >
          <p class="content">${postContent}</p >
          <p class="sent-time">Sent at: ${sendTime}</p >
        </div>
      </body>
    </html>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent successfully!', info.response);
    }
  });
}

// Route for adding an activity to the database
router.post('/posts', (req, res) => {
  const { userId } = req.session;
  const { title, content } = req.body;

  // Connect to the database
  req.pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }

    const query = 'SELECT club_id FROM manager WHERE user_id = ?';
    connection.query(query, [userId], (err2, rows, fields) => {
      if (err2) {
        connection.release();
        res.sendStatus(500);
        return;
      }

      if (rows.length === 0) {
        connection.release();
        res.status(400).send('Post failed!');
        return;
      }

      const clubId = rows[0].club_id;
      const checkQuery = 'SELECT * FROM club WHERE club_id = ?';
      connection.query(checkQuery, [clubId], (err1, rows1) => {
        if (err1) {
          connection.release();
          res.sendStatus(500);
          return;
        }

        if (rows1.length === 0) {
          connection.release();
          res.status(400).send('Club ID does not exist!');
          return;
        }

        const insertQuery = 'INSERT INTO activity (club_id, announcement_title, announcement_content) VALUES (?, ?, ?)';
        connection.query(insertQuery, [clubId, title, content], (err3, rows2) => {
          if (err3) {
            connection.release();
            res.sendStatus(500);
            return;
          }

          // query users' Email
          const userQuery = 'SELECT user_email FROM userClub INNER JOIN user ON userClub.user_id = user.user_id WHERE club_id = ?';
          connection.query(userQuery, [clubId], (err4, rows3) => {
            connection.release();
            if (err4) {
              console.error(err4);
              res.sendStatus(500);
              return;
            }

            // send Email to all user
            rows3.forEach((row) => {
              const userEmail = row.user_email;
              sendEmailToUser(userEmail, title, content);
            });

            res.json(rows2); // send response
          });
        });
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
    connection.query(query, function (err1, rows, fields) {
      connection.release();
      if (err1) {
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
    connection.query(query, function (err1, rows, fields) {
      connection.release();
      if (err1) {
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
    connection.query(query, function (err1, rows, fields) {
      connection.release();
      if (err1) {
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
    connection.query(query, function (err1, rows, fields) {
      connection.release();
      if (err1) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); // send response
    });
  });
});

// Route for joining activities from users to the database
router.post('/message', (req, res) => {
  const { userId } = req.session;
  console.log("Current user in POST /message is: " + userId);
  const { activityID } = req.body;
  console.log("Current activityID in POST /message is: " + activityID)
  // Connect to the database
  req.pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }

    // Check if user_id exists in the userAct table
    const checkQuery = 'SELECT * FROM userAct WHERE user_id = ? AND activity_id = ?';
    connection.query(checkQuery, [userId, activityID], (err2, rows) => {
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
      connection.query(insertQuery, [userId, activityID], (err3, result) => {
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
  const { clubID } = req.body;
  const { userId } = req.session;
  // Connect to the database
  req.pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }

    // query activity_id
    const selectActivityQuery = 'SELECT activity_id FROM activity WHERE club_id = ?';
    connection.query(selectActivityQuery, [clubID], (err1, activityResult) => {
      if (err) {
        connection.release();
        console.error(err1);
        res.sendStatus(500);
        return;
      }

      const activityIds = activityResult.map((row) => row.activity_id);

      // Delete
      const deleteActivityQuery = 'DELETE FROM userAct WHERE activity_id IN (?) AND user_id = ?';
      const deleteClubQuery = 'DELETE FROM userClub WHERE user_id = ? AND club_id = ?';

      connection.query(deleteActivityQuery, [activityIds, userId], (err2) => {
        if (err2) {
          connection.release();
          console.error(err2);
          res.sendStatus(500);
          return;
        }

        connection.query(deleteClubQuery, [userId, clubID], (err3) => {
          connection.release();

          if (err3) {
            console.error(err3);
            res.sendStatus(500);
            return;
          }

          console.log("Successfully exited the club and all activities!");
          res.sendStatus(200);
        });
      });
    });

  });
});

// setting
router.post('/personal_info', function (req, res, next) {
  try {
    // Verify that the data in the request body is not empty
    if (!req.body.user_name || !req.body.user_email || !req.body.user_password) {
      res.sendStatus(400); // Return an error status code, indicating that the request body data is incomplete
      return;
    }

    const updateQuery = 'UPDATE user SET user_name = ?, user_email = ?, user_password = ? WHERE user_id = ?';

    db.getConnection(function (err, connection) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }

      // Check if the new username is already in use
      const checkUsernameQuery = 'SELECT user_id FROM user WHERE user_name = ?';
      connection.query(checkUsernameQuery, [req.body.user_name], function (err, rows) {
        if (err) {
          console.error(err);
          res.sendStatus(500);
          return;
        }

        if (rows.length > 0) {
          const existingUserId = rows[0].user_id;

          // If the existing username belongs to the current user, allow the update
          if (existingUserId === req.body.user_id) {
            checkEmail();
          } else {
            res.status(400).send('Username is already in use.'); // Return an error status code with an error message
          }
        } else {
          checkEmail();
        }
      });

      function checkEmail() {
        // Check if the new email is already in use
        const checkEmailQuery = 'SELECT user_id FROM user WHERE user_email = ?';
        connection.query(checkEmailQuery, [req.body.user_email], function (err, rows) {
          if (err) {
            console.error(err);
            res.sendStatus(500);
            return;
          }

          if (rows.length > 0) {
            const existingUserId = rows[0].user_id;

            // If the existing email belongs to the current user, allow the update
            if (existingUserId === req.body.user_id) {
              executeUpdateQuery();
            } else {
              res.status(400).send('Email is already in use.'); // Return an error status code with an error message
            }
          } else {
            executeUpdateQuery();
          }
        });
      }

      function executeUpdateQuery() {
        // Execute the update query with the provided parameters
        connection.query(updateQuery, [req.body.user_name, req.body.user_email, req.body.user_password, req.body.user_id], function (err) {
          connection.release();

          if (err) {
            console.error(err);
            res.sendStatus(500);
            return;
          }

          req.session.user_name = req.body.user_name;
          console.log("Successfully updated the information of user: " + req.body.username);
          res.end();
        });
      }
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
    connection.query(query, function (err1, results) { // Suppose you have obtained the ID of the currentuser from the request and assigned it to the variable currentuser_id
      connection.release();
      if (err1) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); // send response
    });
  });
});

//  club_all join
router.post('/joinClub', function (req, res) {
  const { club_id } = req.body;
  const { userId } = req.session;
  try {
    // Verify that the data in the request body is empty
    if (!userId || !club_id) {
      res.sendStatus(400);
      return;
    }

    // Check whether the user has joined the club
    const selectQuery = 'SELECT * FROM userClub WHERE user_id = ? AND club_id = ?';
    db.query(selectQuery, [userId, club_id], function (err, rows) {
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
      db.query(insertQuery, [userId, club_id], function (err1) {
        if (err1) {
          if (err1.code === 'ER_DUP_ENTRY') {
            console.log('User is already a member of the club.'); // The user is already a club member
            res.sendStatus(409); // conflict
          } else {
            console.error(err1);
            res.sendStatus(500);
          }
          return;
        }
        console.log(`Successfully added the club ID: ${club_id} to the user ID: ${userId}`);
        res.sendStatus(200);
      });
    });
  } catch (err1) {
    console.error(err1);
    res.sendStatus(500);
  }
});

router.get('/clubs_user', function (req, res) {
  const { userId } = req.session;
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
    db.query(selectQuery, [userId], function (err, rows) {
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
    // Verify that the data in the request body is not empty
    if (!req.body.user_name || !req.body.user_email || !req.body.user_password) {
      res.sendStatus(400); // Return an error status code, indicating that the request body data is incomplete
      return;
    }

    const updateQuery = 'UPDATE user SET user_name = ?, user_email = ?, user_password = ? WHERE user_id = ?';

    db.getConnection(function (err, connection) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }

      // Check if the new username is already in use
      const checkUsernameQuery = 'SELECT user_id FROM user WHERE user_name = ?';
      connection.query(checkUsernameQuery, [req.body.user_name], function (err, rows) {
        if (err) {
          console.error(err);
          res.sendStatus(500);
          return;
        }

        if (rows.length > 0) {
          const existingUserId = rows[0].user_id;

          // If the existing username belongs to the current user, allow the update
          if (existingUserId === req.body.user_id) {
            checkEmail();
          } else {
            res.status(400).send('Username is already in use.'); // Return an error status code with an error message
          }
        } else {
          checkEmail();
        }
      });

      function checkEmail() {
        // Check if the new email is already in use
        const checkEmailQuery = 'SELECT user_id FROM user WHERE user_email = ?';
        connection.query(checkEmailQuery, [req.body.user_email], function (err, rows) {
          if (err) {
            console.error(err);
            res.sendStatus(500);
            return;
          }

          if (rows.length > 0) {
            const existingUserId = rows[0].user_id;

            // If the existing email belongs to the current user, allow the update
            if (existingUserId === req.body.user_id) {
              executeUpdateQuery();
            } else {
              res.status(400).send('Email is already in use.'); // Return an error status code with an error message
            }
          } else {
            executeUpdateQuery();
          }
        });
      }

      function executeUpdateQuery() {
        // Execute the update query with the provided parameters
        connection.query(updateQuery, [req.body.user_name, req.body.user_email, req.body.user_password, req.body.user_id], function (err) {
          connection.release();

          if (err) {
            console.error(err);
            res.sendStatus(500);
            return;
          }

          req.session.user_name = req.body.user_name;
          console.log("Successfully updated the information of user: " + req.body.username);
          res.end();
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});


// user activity
router.get('/user_activity', function (req, res) {
  const { userId } = req.session;
  // Connect to the database
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    var query = 'SELECT a.announcement_title, a.announcement_content FROM activity AS a INNER JOIN userAct AS ua ON a.activity_id = ua.activity_id WHERE ua.user_id = ?';

    connection.query(query, [userId], function (err1, rows, fields) {
      connection.release();
      if (err1) {
        res.sendStatus(500);
        return;
      }
      res.json(rows); // Send response
    });
  });
});

// Activity title
router.get('/activity', function (req, res) {
  // Connect to the database
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    const { userId } = req.session;
    // var user_id = req.params.user_id;
    var clubquery = 'SELECT club_id FROM manager WHERE user_id = ?';
    connection.query(clubquery, [userId], function (err1, results, fields) {
      if (err1) {
        connection.release();
        res.sendStatus(500);
        return;
      }
      if (results.length === 0) {
        // No club found for the user
        connection.release();
        res.sendStatus(404);
        return;
      }

      var { club_id } = results[0];
      var query = 'SELECT announcement_title, activity_id FROM activity WHERE club_id = ?';
      connection.query(query, [club_id], function (err2, rows) {
        connection.release();
        if (err2) {
          res.sendStatus(500);
          return;
        }
        res.json(rows); // Send response
      });
    });
  });
});


// Activity user
router.get('/activity_user/:activity_id', function (req, res) {
  // Connect to the database
  var { activity_id } = req.params;
  console.log(activity_id);
  req.pool.getConnection(function (err1, connection) {
    if (err1) {
      res.sendStatus(500);
      return;
    }
    var userquery = 'SELECT user_id FROM userAct WHERE activity_id = ?';
    connection.query(userquery, [activity_id], function (err2, results, fields) {
      connection.release(); // Release the connection

      if (err2) {
        res.sendStatus(500);
        return;
      }
      if (results.length === 0) {
        // No user found for the activity
        res.sendStatus(404);
        return;
      }

      var user_id = results.map(result => result.user_id);
      console.log("All the users userquery give: " + user_id);
      var query = 'SELECT user_name FROM user WHERE user_id IN (?)';
      connection.query(query, [user_id], function (err, rows) {
        if (err) {
          res.sendStatus(500);
          return;
        }
        res.json(rows); // Send response
      });
    });
  });
});

// Admin remove
router.post('/adminRemove', function (req, res) {
  const { user_name } = req.body;
  try {
    // Validate if the data in the request body is empty
    if (!user_name) {
      res.sendStatus(400); // Return error status code indicating incomplete request body data
      return;
    }

    const adminQuery = 'SELECT * FROM user WHERE user_name = ?';
    db.query(adminQuery, [user_name], function (err) {
      if (err) {
        console.error(err);
        res.sendStatus(500); // Return the server error status code when handling an error
        return;
      }

      const deleteAdmin = 'UPDATE user SET user_identity = "user" WHERE user_name = ?';
      db.query(deleteAdmin, [user_name], function (err) {
        if (err) {
          console.error(err);
          res.sendStatus(500); // Return the server error status code when handling an error
          return;
        }

        console.log(`Successfully remove the admin: ${user_name}!`);
        res.sendStatus(200); // Return success status code
      });
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500); // Return the server error status code when handling an error
  }
});


// Club remove
router.post('/clubRemove', function (req, res) {
  const { club_name } = req.body;

  try {
    // Validate if the data in the request body is empty
    if (!club_name) {
      res.sendStatus(400); // Return error status code indicating incomplete request body data
      return;
    }

    const clubQuery = 'SELECT * FROM club WHERE club_name = ?';
    db.query(clubQuery, [club_name], function (err) {
      if (err) {
        console.error(err);
        res.sendStatus(500); // Return the server error status code when handling an error
        return;
      }

      const deleteClub = 'DELETE FROM club WHERE club_name = ?';
      db.query(deleteClub, [club_name], function (err) {
        if (err) {
          console.error(err);
          res.sendStatus(500); // Return the server error status code when handling an error
          return;
        }

        console.log(`Successfully remove the club: ${club_name}!`);
        res.sendStatus(200); // Return success status code
      });
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500); // Return the server error status code when handling an error
  }
});


// User remove
router.post('/userRemove', function (req, res) {
  const { user_name } = req.body;

  try {
    // Validate if the data in the request body is empty
    if (!user_name) {
      res.sendStatus(400); // Return error status code indicating incomplete request body data
      return;
    }

    const userQuery = 'SELECT * FROM user WHERE user_name = ?';
    db.query(userQuery, [user_name], function (err, rows) {
      if (err) {
        console.error(err);
        res.sendStatus(500); // Return the server error status code when handling an error
        return;
      }

      if (rows.length === 0) {
        console.log(`Member with username ${user_name} does not exist`);
        res.sendStatus(404); // Return status code 404 to indicate that the user does not exist
        return;
      }

      const deleteQuery = 'DELETE FROM user WHERE user_name = ?';
      db.query(deleteQuery, [user_name], function (err) {
        if (err) {
          console.error(err);
          res.sendStatus(500); // Return the server error status code when handling an error
          return;
        }

        console.log(`Successfully removed the user: ${user_name}!`);
        res.sendStatus(200); // Return success status code
      });
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500); // Return the server error status code when handling an error
  }
});

// set admin
router.post('/setAdmin', function (req, res) {
  const { user_name } = req.body;

  try {
    // Validate if the data in the request body is empty
    if (!user_name) {
      res.sendStatus(400); // Return error status code indicating incomplete request body data
      return;
    }

    const userQuery = 'SELECT * FROM user WHERE user_name = ?';
    db.query(userQuery, [user_name], function (err, rows) {
      if (err) {
        console.error(err);
        res.sendStatus(500); // Return the server error status code when handling an error
        return;
      }

      if (rows.length === 0) {
        console.log(`Member with username ${user_name} does not exist`);
        res.sendStatus(404); // Return status code 404 to indicate that the user does not exist
        return;
      }

      const identityQuery = 'SELECT user_identity FROM user WHERE user_name = ?';
      db.query(identityQuery, [user_name], function (err) {
        if (err) {
          console.error(err);
          res.sendStatus(500); // Return the server error status code when handling an error
          return;
        }

        const adminSetQuery = 'UPDATE user SET user_identity = ? WHERE user_name = ?';
        db.query(adminSetQuery, ['admin', user_name], function (err) {
          if (err) {
            console.error(err);
            res.sendStatus(500); // Return the server error status code when handling an error
            return;
          }

          console.log(`Successfully set ${user_name} as admin!`);
          res.sendStatus(200); // Return success status code
        });
      });
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500); // Return the server error status code when handling an error
  }
});


// admin/user.html get user_name
router.get('/userName', function (req, res) {
  try {
    const userQuery = 'SELECT * FROM user WHERE user_identity = "user"';
    db.query(userQuery, function (err, rows) {
      if (err) {
        console.error(err);
        res.sendStatus(500); // Return the server error status code when handling an error
        return;
      }

      res.json(rows); // Send user data as response
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500); // Return the server error status code when handling an error
  }
});


router.get('/adminName', function (req, res) {
  try {
    const userQuery = 'SELECT * FROM user WHERE user_identity = "admin"';
    db.query(userQuery, function (err, rows) {
      if (err) {
        console.error(err);
        res.sendStatus(500); // Return the server error status code when handling an error
        return;
      }
      res.json(rows); // Send user data as response
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500); // Return the server error status code when handling an error
  }
});


router.get('/clubName', function (req, res) {
  try {
    const clubQuery = 'SELECT club_name FROM club ';
    db.query(clubQuery, function (err, rows) {
      if (err) {
        console.error(err);
        res.sendStatus(500); // Return the server error status code when handling an error
        return;
      }

      res.json(rows); // Send user data as response
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500); // Return the server error status code when handling an error
  }
});


// get club member names
router.get('/clubmembersName', function (req, res) {
  const { userId } = req.session;

  try {
    const clubQuery = 'SELECT club_id FROM manager WHERE user_id = ?';
    db.query(clubQuery, [userId], function (err, results) {
      if (err) {
        console.error(err);
        res.sendStatus(500); // Handle error by returning server error status code
        return;
      }

      console.log(clubQuery, userId);

      var clubId = results[0].club_id;

      const userQuery = 'SELECT user.user_name FROM userClub JOIN user ON userClub.user_id = user.user_id WHERE userClub.club_id = ?';
      db.query(userQuery, [clubId], function (err, results) {
        if (err) {
          console.error(err);
          res.sendStatus(500); // Handle error by returning server error status code
          return;
        }

        console.log(results);

        res.json(results); // Send user names as response
      });
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500); // Handle error by returning server error status code
  }
});


// club member remove
router.post('/clubmembersRemove', function (req, res) {
  const { user_name } = req.body;

  try {
    // Validate if the data in the request body is empty
    if (!user_name) {
      res.sendStatus(400); // Return error status code indicating incomplete request body data
      return;
    }

    const userQuery = 'SELECT user_id FROM user WHERE user_name = ?';
    db.query(userQuery, [user_name], function (err, rows) {
      if (err) {
        console.error(err);
        res.sendStatus(500); // Return the server error status code when handling an error
        return;
      }

      if (rows.length === 0) {
        console.log(`Member with username ${user_name} does not exist`);
        res.sendStatus(404); // Return status code 404 to indicate that the user does not exist
        return;
      }

      const { user_id } = rows[0];
      const getUserActivitiesQuery = `
        SELECT ua.activity_id
        FROM userAct ua
        INNER JOIN activity a ON ua.activity_id = a.activity_id
        WHERE ua.user_id = ?;
      `;
      db.query(getUserActivitiesQuery, [user_id], function (err, activityRows) {
        if (err) {
          console.error(err);
          res.sendStatus(500);
          return;
        }

        const activityIds = activityRows.map(row => row.activity_id);

        const deleteClubMembershipQuery = 'DELETE FROM userClub WHERE user_id = ?';
        db.query(deleteClubMembershipQuery, [user_id], function (err) {
          if (err) {
            console.error(err);
            res.sendStatus(500);
            return;
          }

          function removeUserFromActivities(user_id, activityIds) {
            if (activityIds.length === 0) {
              console.log(`Successfully removed the user!`);
              res.sendStatus(200);
              return;
            }

            const deleteFromActivitiesQuery = 'DELETE FROM userAct WHERE user_id = ? AND activity_id = ?';
            const activityId = activityIds.pop();
            db.query(deleteFromActivitiesQuery, [user_id, activityId], function (err) {
              if (err) {
                console.error(err);
                res.sendStatus(500);
                return;
              }
            });
          }

          removeUserFromActivities(user_id, activityIds);
        });
      });
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500); // Return the server error status code when handling an error
  }
});


module.exports = router;



module.exports = router;
