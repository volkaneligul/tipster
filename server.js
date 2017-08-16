const express = require('express'),
app = express(),
bodyParser = require('body-parser'),
cors = require('cors'),
mongoose = require('mongoose'),
config = require('./config/DB'),
session = require('express-session'),
MongoStore = require('connect-mongo')(session);

// connect to mongodb
//mongoose.connect('mongodb://localhost/ninjago');
//mongoose.connect('mongodb://heroku_cd8j2zbv:a3pci2krism8oqcun4bgs3e7am@ds161262.mlab.com:61262/heroku_cd8j2zbv', {
//    useMongoClient: true
//})
//mongoose.Promise = global.Promise;

// connect to mongodb
mongoose.Promise = global.Promise;
mongoose.connect(config.DB).then(() => { console.log('Database is connected') },
    err => { console.log('Can not connect to the database'+ err) }
);

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

app.use(cors());

// initialize routes
app.use('/api', require('./routes/api'));
app.use('/user', require('./routes/user'));
app.use('/item', require('./routes/item'));

// error handling middleware
app.use(function(err, req, res, next){
    console.log(err); // to see properties of message in our console
    res.status(422).send({error: err.message});
});

// listen for requests
app.listen(process.env.PORT || 4000, function(){
    console.log('now listening for requests');
});
