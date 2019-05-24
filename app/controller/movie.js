
var Movie =require("../models/movie");
var Comment =require("../models/comment");
var _ =require("underscore");

// detail page
// app.get("/movie/:id",function (req,res) {
exports.detail =function(req, res) {
    var id =req.params.id;
    
    Movie.findById(id, function (err, movie) {
        Comment
            .find({movie: id})
            .populate("from", "name")
            .populate("reply.from reply.to", "name")
            .exec( function(err, comments) {
            // console.log(comments);
            res.render("detail", {
                title:"imooc "+movie.title,
                movie: movie,
                comments: comments
            });
        });  
    });
};
    


// admin page，将movie数据传递给admin/movie/new的路由
// app.get("/admin/movie" ,function (req,res) {
exports.new =function(req, res) {
    res.render("admin", {
        title:"imooc 后台录入页",
        movie: {
            title :"小力王训练",
            doctor :"none",
            country :"美国",
            year :"2019",
            poster :"https://ss3.bdstatic.com/6Ls0a8Sm2Q5IlBGlnYG/timg?video&quality=100&size=f130_98&sec=1366351082&di=aba9fd1e6654dd78585cd9864eff354a&src=http%3A%2F%2Ft1.baidu.com%2Fit%2Fu%3D657446044%2C399003170%26fm%3D20",
            flash :"http://resources.baomihua.com/swf/bd_video_player.swf?flvid=36908561&qudao=baiduVideo",
            summary :"小力王",
            language :"英语"
        }
    });
};
    


// admin update movie
// app.get("/admin/update/:id" ,function (req,res) {
exports.update =function(req, res) {
    var id =req.params.id;
    
    if(id) {
        Movie.findById(id, function (err, movie) {
            res.render("admin", {
                title: "imooc 后台更新页",
                movie: movie
            })
        })
    }
};

// admin post movie，由该路由将数据存储到数据库
// app.post("/admin/movie/new", function(req, res) {
exports.save =function(req, res) {
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
};



// list page
// app.get("/admin/list",function (req,res) {
exports.list =function(req, res) {
    Movie.fetch(function (err, movies) {
        if(err) {
            console.log(err);
        }
        res.render("list", {
            title:"imooc 列表页",
            movies: movies
        });
    })
};


// app.delete("/admin/list", function(req,res) {
exports.del =function(req, res) {
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
};

