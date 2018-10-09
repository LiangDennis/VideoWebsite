var express =require("express");//加载模块
var path =require("path")//定义样式的查找路径
var mongoose =require("mongoose");
var Movie =require("./models/movie");
var _ =require("underscore");
var port =process.env.PORT | 3000;//设置默认端口

var bodyParser =require("body-parser");
var serveStatic =require("serve-static");


var app =express();//启动一个web 服务器

mongoose.connect("mongodb://localhost/imooc");




app.set("views","./views/page");//设置视图的根目录
app.set("view engine","jade");//设置默认的摸版引擎
//app.use(bodyParser)//将表单的数据进行格式化，因为不是express模块内的内容，被独立出来，所以要修改


app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.locals.moment =require("moment")


app.use(serveStatic(path.join(__dirname, 'bower_components')))//与path对应，__dirname是两条下杠
app.listen(port);//监听这个端口

console.log("start in port:"+port);

// 创建好jade的页面后，加上路由
// index page
// get是访问页面时需要输入的路径，render是获取到jade文件的路径
app.get("/",function(req,res) {
    Movie.fetch(function(err, movies) {
        if(err) {
            console.log(err);
        }
        
        res.render("index", {
            title:"imooc 首页",
            movies:movies
        });
    }); 
});


// detail page
app.get("/movie/:id",function (req,res) {
    var id =req.params.id;
    Movie.findById(id, function (err, movie) {
        res.render("detail", {
            title:"imooc "+movie.title,
            movie: movie
        });
    })
});


// admin page，将movie数据传递给admin/movie/new的路由
app.get("/admin/movie" ,function (req,res) {
    res.render("admin", {
        title:"imooc 后台录入页",
        movie: {
            title :"中国风白酒古法酿酒酒曲",
            doctor :"wangxiaoyi",
            country :"中国",
            year :"2019",
            poster :"http://pic.vjshi.com/2017-11-14/8647636fae3aa37a126e36525f104b17/online/puzzle.jpg?x-oss-process=style/watermark",
            flash :"http://mp4.vjshi.com/2017-11-14/8647636fae3aa37a126e36525f104b17.mp4",
            summary :"中国风白酒古法酿酒酒曲",
            language :"汉语"
        }
    });
});


// admin update movie
app.get("/admin/update/:id" ,function (req,res) {
    var id =req.params.id;

    if(id) {
        Movie.findById(id, function (err, movie) {
            res.render("admin", {
                title: "imooc 后台更新页",
                movie: movie
            })
        })
    }
})


// admin post movie，由该路由将数据存储到数据库
app.post("/admin/movie/new", function(req, res) {
    var id =req.body.movie._id;
    var movieObj =req.body.movie;
    // console.log(req.body.movie._id);
    // console.log(req.body.movie);
    // console.log(movieObj);
    var _movie;

    if (id !== "undefined") {
        Movie.findById(id, function (err, movie) {
            if(err) {
                console.log(err);
            }

            _movie =_.extend(movie, movieObj);//用新的字段（movieObj）替换原来的字段（movie）
            _movie.save(function(err, movie) {
                if(err) {
                    console.log(err);
                }
                res.redirect("/movie/" +movie._id);
            })
        })
    }
    else {
        _movie =new Movie({
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country,
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash:movieObj.flash
        });
        

        _movie.save(function (err, movie) {
            if(err) {
                console.log(err);
            }
            res.redirect("/movie/" +movie._id);
        })
    }
})


// list page
app.get("/admin/list",function (req,res) {
    Movie.fetch(function (err, movies) {
        if(err) {
            console.log(err);
        }
        res.render("list", {
            title:"imooc 列表页",
            movies: movies
        });
    })
});

app.delete("/admin/list", function(req,res) {
    var id =req.query.id;

    if(id) {
        Movie.remove({_id:id}, function(err, movie) {
            if(err) {
                console.log(err);
            }else {
                res.json({success:1})
            }
        })
    }
});


//test page
app.get("/test",function (req,res) {
    res.render("test/test",{
        title:"some test here"
    });
})