import express from 'express';
import path from 'path';
import compression from 'compression';

/* eslint-disable no-console */

const app = express();

app.use(compression()); // for express gzip
app.use(express.static('dist'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// listen for requests
app.listen(process.env.PORT || 4000, function(){
    console.log('now listening for requests');
});
