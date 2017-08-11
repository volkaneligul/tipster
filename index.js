const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// set up express app
const app = express();

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

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
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

app.get('/', function(req, res) {

    // ejs render automatically looks in the views folder
    res.render('index');
});

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
app.listen(process.env.port || 4000, function(){
    console.log('now listening for requests');
});
