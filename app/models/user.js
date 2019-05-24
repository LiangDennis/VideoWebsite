var mongoose =require("mongoose");
var UserSchema =require("../schemas/user");
var User =mongoose.model("User", UserSchema);//传入模型的名字和模式

module.exports = User;