

// 将movie，user，index引入
var Index =require("../app/controller/index");
var User =require("../app/controller/user");
var Movie =require("../app/controller/movie");
var Comment =require("../app/controller/comment");

// 将路由的信息exports出去
module.exports =function(app) {
    // 因为header.jade 用到user 参数，实现登出的渲染，用use而不是用get或者post
    app.use(function (req, res, next) {
        var _user =req.session.user;//有session将session赋值，没有就赋locals的值
        app.locals.user =_user;
        next();
    });

    // 创建好jade的页面后，加上路由
    // get是访问页面时需要输入的路径，render是获取到jade文件的路径

    //Index
    app.get("/", Index.index);

    //User
    app.post("/user/signup", User.signup);//注 册signup
    app.post("/user/signin", User.signin);// sigin in登录
    app.get("/signin", User.showSignin);// 登录页面，上面两个是模态窗口
    app.get("/signup", User.showSignup);// 注册页面
    app.get("/logout", User.logout);// logout 登出功能
    app.get("/admin/userlist",User.signinRequired ,User.adminRequired, User.list)// 用户列表

    //Movie
    app.get("/movie/:id", Movie.detail);// detail page
    app.get("/admin/movie" ,User.signinRequired ,User.adminRequired, Movie.new);// admin page，将movie数据传递给admin/movie/new的路由
    app.get("/admin/update/:id" ,User.signinRequired ,User.adminRequired, Movie.update);// admin update movie
    app.post("/admin/movie/new",User.signinRequired ,User.adminRequired, Movie.save);// admin post movie，由该路由将数据存储到数据库
    app.get("/admin/list",User.signinRequired ,User.adminRequired, Movie.list);// list page
    app.delete("/admin/list",User.signinRequired ,User.adminRequired, Movie.del);

    //Comment
    app.post("/user/comment",User.signinRequired, Comment.save);
};

