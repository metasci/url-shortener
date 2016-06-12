var express = require('express');
var routes = require('./app/index.js');
var api = require('./app/shortener.js');
var mongo = require('mongodb').MongoClient;



var app = express();
app.use('/client', express.static(process.cwd() + '/client'));


var url = 'mongodb://localhost:27017/myDb';

mongo.connect(url, function(err, db){
  
  if(err) throw 'Database failed to connect';
  
  db.createCollection("shortUrls", {
    capped: true,
    size: 10000000,
    max: 10000
  });
  
  
  routes(app, db);
  
  api(app, db);
  
  
  
  
});




var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log('listening on port ' + port + '...');
});