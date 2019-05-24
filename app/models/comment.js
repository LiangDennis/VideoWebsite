var mongoose =require("mongoose");
var CommentSchema =require("../schemas/comment");
var Comment =mongoose.model("comment", CommentSchema);//传入模型的名字和模式

module.exports = Comment;