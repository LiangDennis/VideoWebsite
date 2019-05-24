
var Movie =require("../models/movie");

exports.index =function(req, res) {
    // index page
    // get是访问页面时需要输入的路径，render是获取到jade文件的路径
    // app.get("/",function(req,res) {
        // console.log(req.session.user);
    // });
    Movie.fetch(function(err, movies) {
        if(err) {
            console.log(err);
        }
        
        res.render("index", {
            title:"imooc 首页",
            movies:movies
        });
    });   
};

