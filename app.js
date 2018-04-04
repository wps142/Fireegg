var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var FileStore = require('session-file-store')(session);

var mysqlDb = require('./dao/mysql-operator');
var index = require('./routes/index');

//将页面对应的route文件声明
var home =  require('./routes/index');
var mail = require('./routes/mail');
var reportProblem = require('./routes/reportProblem');
var signin = require('./routes/signin');
var signup = require('./routes/signup');
var discount = require('./routes/discount');
var products = require('./routes/products');

var app = express();


// var bodyJson = bodyParser.json();
// var bodyUrlencoded = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('cpts_727_beb', path.join(__dirname, 'cpts_727_beb'));
//app.set('themes', path.join(__dirname, 'themes'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));//将public目录设置为根目录,其下目录可以直接使用
// 使用 session 中间件
app.use(session({
    secret : 'secret', // 对session id 相关的cookie 进行签名
    store: new FileStore(), // 本地存储session
    resave : true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie : {
        maxAge : 1000 * 60 * 30, // 设置 session 的有效时间，单位毫秒
    }
}));

app.use('/index', index);
//指定页面路径,指定对应的route文件
app.use('/', home);
app.use('/mail',mail);
app.use('/reportProblem',reportProblem);
app.use('/signin',signin);
app.use('/signup',signup);
app.use('/discount',discount);
app.use('/products',products);

//登录验证
app.post("/signin/validate",function (req,res) {

    mysqlDb.query("select * from user where email = ? and pwd = ?",[req.body.email,req.body.password],
        function (err,field) {
            if (err) {
                console.log(err);
                res.redirect("/signin");
                return;
            }

            if(field.length == 0) {
                //用户名或密码错误
                console.log("用户名或密码错误");
                res.json({ret_code: 1, ret_msg: '账号或密码错误'});
                // res.redirect("/signin");
                return;
            }

            //登录成功，跳转到主页
            //添加到session中
            req.session.email = field[0].email;
            req.session.country = field[0].country;
            req.session.name = field[0].name;

            res.redirect("/index");

        });
    //登录失败，回到登录页

});

//注册
app.post("/signup/data",function (req,res) {

    var user = req.body;
    //验证用户是否存在
    mysqlDb.query("select count(*) cnt from user where email = ?",[user.email],function (err,field) {
        if (err) {
          res.send(err);
          return;
        }
        //不存在入库，页面跳转登录页
        if (field[0].cnt == 0) {
          console.log(user);
          var addParams = [user.country,user.name,user.email,user.password];
          mysqlDb.insert("insert user(country,name,email,pwd) values(?,?,?,?)",addParams,function (i_err,i_field) {
            if (i_err) {
              console.log("注册失败");
              console.log(i_err);
              return;
            }
            console.log("注册成功");
            res.redirect('/signin');
          });

        } else {
          res.redirect('/signup');
        }
    });
});

//发送邮件
app.post("/mail/toUs",function(req,res) {

    var info = req.body;
    var params = [info.email,info.name,info.country,info.message];

    //只要记录数据
    mysqlDb.insert("insert into mail(email,name,country,message) values(?,?,?,?)",params,function (err,field) {
        if (err) {
            console.log(err);
            res.send(err);
            return;
        }

        res.send("发送成功");
    });

});


//发送问题邮件
app.post("/reportProblem/toUs",function(req,res) {

    var info = req.body;
    var params = [info.email,info.name,info.country,info.message,info.orderId,'Y'];

    //只要记录数据
    mysqlDb.insert("insert into mail(email,name,country,message,order_id,report_problem) values(?,?,?,?,?,?)",params,function (err,field) {
        if (err) {
            console.log(err);
            res.send(err);
            return;
        }

        res.send("发送成功");
    });

});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

    var authElement = false;
    if (req.session.email) {
        authElement = true;
    }
  res.render('error',{'authElement' : authElement});
});

module.exports = app;
