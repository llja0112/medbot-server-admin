var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var redis = require('redis');
var sub = redis.createClient(process.env.REDIS_URL);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

// io.on('connection', function (socket) {
// });

sub.on('message', function (channel, message) {
  console.log(channel + ': ' + message);
  io.emit('new message', {
    message: message
  });
});

sub.subscribe("message status channel");
