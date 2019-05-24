
var User =require("../models/user");

// 注册页面
exports.showSignup =function(req, res) {
    res.render("signup", {
        title:"注册页面"
    });
};
// 登录页面
exports.showSignin =function(req, res) {
    res.render("signin", {
        title:"登录页面"
    });
};

//注 册signup
// app.post("/user/signup",function(req, res) {
exports.signup =function (req ,res) {
    var _user =req.body.user;
    // console.log(_user);
    // username是否冲突
    User.find({name: _user.name}, function(err, user) {
        if(err) {
            console.log(err);
        }
        // console.log(user);
        if(user.length >0) {//空数组是false，其他都不成立，可以根据长度判断是否是空数组
            return res.redirect("/signin");
        }else {
            // console.log("new user");
            var user =new User(_user);//没有就创建新用户
            user.save(function(err, user) {
                // console.log("我是将数据保存到数据库的！");
                if(err) {
                    console.log(err);
                }

                // console.log(user);
                res.redirect("/");
            });
        }
    })
};
    


// sigin in登录
// app.post("/user/signin", function (req,res){
exports.signin =function (req, res) {
    var _user =req.body.user;
    var name =_user.name;
    var password =_user.password;

    User.findOne({name:name}, function(err, user) {
        if(err) {
            console.log(err);
        }
        //用户不存在，对象可以这样用
        if(!user) {
            return res.redirect("/signup");
        }
        // 密码是否匹配，实例方法与静态方法
        user.comparePassword(password,function (err, isMatch) {
            if(err) {
                console.log(err);
            }
            if(isMatch) {
                req.session.user =user;//保存用户状态
                return res.redirect("/");
            }else {
                return res.redirect("/signin");
                // console.log("password is not matched");
            }
        })
    });
};

// logout 登出功能
// app.get("/logout", function (req, res) {
exports.logout =function (req, res) {
    delete req.session.user;
    // delete app.locals.user;//保存在实例上的属性，而不是req上的属性，app没法访问了
    res.redirect("/");
};


// 用户列表
// app.get("/admin/userlist", function(req,res) {
exports.list =function (req ,res) {
    User.fetch(function (err, users) {
        if(err) {
            console.log(err);
        }

        res.render("userlist", {
            title:"imooc 用户列表页",
            users:users 
        });
    });
};

// 用户是否登录的中间件 midware for user
exports.signinRequired =function(req, res, next) {
    var user =req.session.user;

    if(!user) {
        return res.redirect("/signin");
    }
    next();
};
// 用户是否是管理员的中间件 midware for user
exports.adminRequired =function(req, res, next) {
    var user =req.session.user;
    // 还要判断role是否存在，但是在schema里面已经定义了default，所以这里没有判断
    if(user.role <=10) {//权限不够
        return res.redirect("/signin");
    }
    next();
};