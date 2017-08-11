const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// set up express app
const app = express();

app.set('port', (process.env.PORT || 5000));

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring = 
  process.env.MONGODB_URI || 
  'mongodb://localhost/ninjago';

// connect to mongodb
//mongoose.connect('mongodb://localhost/ninjago');
//mongoose.connect('mongodb://heroku_cd8j2zbv:a3pci2krism8oqcun4bgs3e7am@ds161262.mlab.com:61262/heroku_cd8j2zbv', {
//    useMongoClient: true
//})
//mongoose.Promise = global.Promise;

// connect to mongodb
mongoose.connect(uristring, { useMongoClient: true },  function (err, res) {
    if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
    console.log ('Succeeded connected to: ' + uristring);
    }
});
mongoose.Promise = global.Promise;

//set up static files
app.use(express.static('public'));

// use body-parser middleware
app.use(bodyParser.json());

// initialize routes
app.use('/api', require('./routes/api'));

// error handling middleware
app.use(function(err, req, res, next){
    console.log(err); // to see properties of message in our console
    res.status(422).send({error: err.message});
});

// listen for requests
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port')); 
});
