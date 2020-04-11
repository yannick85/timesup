var express = require('express');
var app = express();

app.use(express.static('./front/dist'));

var http = require('http').createServer(app);

var port = process.env.PORT || 5000

http.listen(port, function(){
  console.log('listening on *:5000');
});

require('./socket/main.js')(http);