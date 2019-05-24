var express =require("express");//加载模块
var path =require("path")//定义样式的查找路径
var mongoose =require("mongoose");
var logger =require("morgan");
var port =process.env.PORT | 3000;//设置默认端口

// express4升级
var bodyParser =require("body-parser");
var cookieParser =require("cookie-parser");
var session =require("express-session");
var mongoStore =require("connect-mongo")(session);
var serveStatic =require("serve-static");

var app =express();//启动一个web 服务器

var dbUrl ="mongodb://localhost/imooc";
mongoose.connect(dbUrl);


app.set("views","./app/views/page");//设置视图的根目录
app.set("view engine","jade");//设置默认的摸版引擎
//app.use(bodyParser)//将表单的数据进行格式化，因为不是express模块内的内容，被独立出来，所以要修改

// express升级
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret:"imooc",
    resave:false,
    saveUninitialized:true,
    store: new mongoStore({
        url :dbUrl,
        collection: "sessions"
    })
}));
app.locals.moment =require("moment")


app.use(serveStatic(path.join(__dirname, 'bower_components')))//与path对应，__dirname是两条下杠
app.listen(port);//监听这个端口
console.log("start in port:"+port);

// 如果是开发环境就设置某些属性
if("development" === app.get("env")) {
    app.set("showStackError", true);
    app.use(logger(":method :url :status"));//查看日志，后面是定义了查看请求的格式：请求方法：请求的Url：请求的状态
    app.locals.pretty =true;//代码可读性更好
    mongoose.set("debug", true);//查看数据库传递的信息
}

require("./config/route")(app);//引入路由