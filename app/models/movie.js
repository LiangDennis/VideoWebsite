var mongoose =require("mongoose");
var MovieSchema =require("../schemas/movie");
var Movie =mongoose.model("movie", MovieSchema);//传入模型的名字和模式

module.exports = Movie;