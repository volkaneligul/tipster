const express = require('express');
// set up express app
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
var uristring = 
  process.env.MONGODB_URI || 
  'mongodb://localhost:27017/tipster';

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
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

//set up static files
app.use(express.static('public'));

// use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// initialize routes
app.use('/api', require('./routes/api'));
app.use('/user', require('./routes/user'));

// error handling middleware
app.use(function(err, req, res, next){
    console.log(err); // to see properties of message in our console
    res.status(422).send({error: err.message});
});

// listen for requests
app.listen(process.env.PORT || 4000, function(){
    console.log('now listening for requests');
});
