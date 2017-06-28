var express = require('express');
var pg = require('pg');
var http = require('http');
var bodyParser = require('body-parser')
var app = express();

const path = require('path');
const clientBuildDir = __dirname + '/../../client/dist/';

// Our controllers that will handle requests after this router hands off the data to them.
import { LoginController } from './controllers/login_controller';
import { DonorController } from './controllers/donor_controller';
import { ReceiverController } from './controllers/receiver_controller';

var loginController : LoginController = new LoginController();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(clientBuildDir));
app.use(bodyParser.json());

/*app.get('/times', function(request, response) {
  var result = '';
  var times = process.env.TIMES || 5;
  for (var i = 0; i < times; i++)
    result += i + ' ';
  response.send(result);
});

app.get('/db', function(request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) {
	console.error(err);
	response.send('Error ' + err);
	return;
    }
    client.query('SELECT * FROM test_table;', function(err, result) {
      done();
      if (err) {
        console.error(err);
	response.send('Error ' + err);
      }
      else {
        response.render('pages/db', {results: result.rows});
      }
    });
  });
});*/

// Handle /login route by passing off to LoginController.
app.post('/login', loginController.login);

app.get('*', function (request, response) {
      response.sendFile(path.join(clientBuildDir + '/index.html'));
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


