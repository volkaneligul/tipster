import express from "express";
import path from "path";
import webpack from "webpack";
import devConfig from "../webpack.config.dev";

 /* eslint-disable no-console */

const app = express();
const compiler = webpack(devConfig);

const bodyParser = require('body-parser'),
cors = require('cors'),
mongoose = require('mongoose'),
DBconfig = require('../config/DB'),
session = require('express-session'),
MongoStore = require('connect-mongo')(session);

mongoose.Promise = global.Promise;
mongoose.connect(DBconfig.DB).then(() => { console.log('Database is connected') },
    err => { console.log('Can not connect to the database'+ err) }
);

var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

app.use(require("webpack-dev-middleware")(compiler, {
  noInfo: true,
  publicPath: devConfig.output.publicPath
}));

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
app.use('/api', require('../routes/api'));
app.use('/user', require('../routes/user'));
app.use('/item', require('../routes/item'));

// error handling middleware
app.use(function(err, req, res, next){// eslint-disable-line no-unused-vars
    console.log(err); // to see properties of message in our console
    res.status(422).send({error: err.message});
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// listen for requests
app.listen(process.env.PORT || 4000, function(){
    console.log('now listening for requests');
});
