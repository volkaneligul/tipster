const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// set up express app
const app = express();

// connect to mongodb
//mongoose.connect('mongodb://localhost/ninjago');
mongoose.connect('mongodb://heroku_cd8j2zbv:mlab3819882@ds161262.mlab.com:61262/heroku_cd8j2zbv', {
    useMongoClient: true
})
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
app.listen(process.env.port || 4000, function(){
    console.log('now listening for requests');
});
