
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , login = require('./routes/login')
  , homes = require('./routes/homes')
  , projects = require('./routes/projects')
  , blogs = require('./routes/blogs')
  , notes = require('./routes/notes')
  , resume = require('./routes/resume')
  , stylus = require('stylus')
  , nib = require('nib')
  , http = require('http')
  , passport = require('passport')
  , path = require('path')
  , daemon = require('daemon')
  , config = require('./config.json');

var app = express();

function compile(str,path){
  return stylus(str).set('filename',path).use(nib());
}

// http://stackoverflow.com/a/11632909/974800
daemon.daemonize({
    stdout: '/var/log/nodejs/'+ config.server_name + '.log',
    stderr: '/var/log/nodejs/'+ config.server_name + '.error.log'
  }, './node.pid', function(err, pid) {
    if (err) {
      console.log('error starting daemon: ', err);
      return process.exit(-1);
    }
    console.log('daemon started with pid: ' + pid);
});

app.configure(function(){
  app.set('port', process.env.PORT || 13231);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(config.cookie_secret));
  app.use(express.session());
  //app.use(passport.initiailize());
  //app.use(passport.session());
  app.use(app.router);
  app.use(stylus.middleware({src: __dirname + '/public',compile: compile}));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', homes.index);
app.get('/login', login.index);
app.get('/homes', homes.index);
app.get('/notes', notes.list);
app.get('/notes/:id', notes.get_one);
app.get('/projects', projects.list);
app.get('/projects/:id', projects.get_one);
app.get('/blogs', blogs.list);
app.get('/blogs/:id', blogs.get_one);
app.get('/resume', resume.list);
app.get('/users', user.list);
app.post('/login', login.authenticate);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
