var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// 此部分写成配置
var routes = require('./routes/index');
var users = require('./routes/users');
var carmanage = require('./routes/carmanage');
var license = require('./routes/license');
var marksinfo = require('./routes/marksinfo');
var records = require('./routes/records');
var mycar = require('./routes/mycar');
var addlicense = require('./routes/addlicense');

var trend = require('./routes/trend');
var trendDetail = require('./routes/trendDetail');

var ejs = require('ejs');
var app = express();
var fs = require('fs');

/*var events = require('events'); 
var emitter = new events.EventEmitter(); */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// 酱紫就可以直接出html静态文件了
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
// 静态文件配置
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// 设置静态资源路径
app.use(express.static(path.join(__dirname, 'public/static')));

/*
fs.readFile('routes.json', {flag: 'r+', encoding: 'utf8'}, function (err, data) {
  var routeData = JSON.parse(data);
  emitter.emit('getRoutes', routeData);
  
})*/

// 新增接口路由
app.get('/data/:module', function (req, res, next) {
    var c_path = req.params.module;
    var Action = require('./server/action/data/' + c_path);
    Action.execute(req, res);
});

// 启动一个服务，监听从8888端口进入的所有连接请求
var server = app.listen(9999, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
}); 
// config routes
app.use('/', carmanage);
app.use('/users', users);
app.use('/addcarinfo.html', carmanage);
app.use('/records.html', records);
app.use('/license.html', license);
app.use('/marksinfo', marksinfo);
app.use('/carinfo.html', mycar);
app.use('/addlicense.html', addlicense);
app.use('/trend.html', trend);
app.use('/trendDetail.html', trendDetail);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err.message);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
