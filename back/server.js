var app = require('express')();
var http = require('http').createServer(app);

http.listen(5000, function(){
  console.log('listening on *:5000');
});

require('./socket/main.js')(http);