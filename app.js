/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path'),
  stylus = require('stylus'),
  nib = require('nib');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(stylus.middleware({
  src: __dirname + '/views', // .styl files are located in `views/stylesheets`
  dest: __dirname + '/public', // .styl resources are compiled `/stylesheets/*.css`
  compile: function (str, path) { // optional, but recommended
    return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib());
  }
}));

app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
};


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/api/name', api.name);
app.get('/api/game', api.game);
app.get('/api/startgame', api.startgame);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io Communication
io.set('log level', 1);
io.sockets.on('connection', function(socket) {
  require('./routes/socket')(io.sockets, socket);
})

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
