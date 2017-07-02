var express = require('express');
var session = require('express-session')
var pg = require('pg');
var http = require('http');
var bodyParser = require('body-parser')
const path = require('path');

var connectionPool = require('./database_help/connection_pool');

// Our controllers that will handle requests after this router hands off the data to them.
import { AuthenticationController } from './authentication/authentication_controller';
import { DonorController } from './donor/donor_controller';
import { ReceiverController } from './receiver/receiver_controller';

var app = express();

// This is where compiled client ts files will go. We need this to locate index.html!
const clientBuildDir = __dirname + '/../../client/dist/';
// Make sure that we can locate our environmental variable (.env) file!
require('dotenv').config({path: __dirname + '/../../.env'});

// Some configuration settings for our App.
app.set('port', (process.env.NODE_PORT || 5000));
app.use(express.static(clientBuildDir));
app.use(bodyParser.json());
app.use(session({ 
  secret: 'xefbwefiefw',
  cookie: { maxAge: 60000 }, // 1 hour.
  resave: false,
  saveUninitialized: false 
}));

// Initialize our Controller objects. These are used to actually handle routes defined in this file.
var authenticationController : AuthenticationController = new AuthenticationController();
var donorController : DonorController = new DonorController();
var receeverController : ReceiverController = new ReceiverController();

/**
 * This is a crude example of connecting to the database.
 * You can look at it to see what is going on.
 */
app.get('/db', function(request, response) {
  // Grab a connection. This comes in the form of a Promise.
  connectionPool.connect().then(client => {
    // Grabbing a connection succeeded. Now we can execute a query using a callback function.
    client.query('SELECT * FROM test_table;', function(err, result) {
      if (err) {
        console.error(err);
	      response.send('Error ' + err);
      }
      else {
        response.send({results: result.rows});
      }
    });

    // We can execute another query using a Promise.
    client.query('SELECT * FROM test_table;').then(res => {
      client.done();
      console.log(res.rows[0]);
    })
    .catch(err => {
      client.done(); // Make sure to release the connection back into the connection pool when finished!!!!!!!
      console.error('query error', err.message, err.stack);
      response.send('Error ' + err);
    });
  })
  .catch(err => {
    console.error('query error', err.message, err.stack);
    response.send('Error ' + err);
  });
});

// Handle /login route by passing off to LoginController.
app.post('/login', authenticationController.login.bind(authenticationController));

app.get('*', function (request, response) {
    console.log(process.env.DATABASE_URL);
      response.sendFile(path.join(clientBuildDir + '/index.html'));
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


