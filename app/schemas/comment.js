var mongoose =require("mongoose");
var Schema =mongoose.Schema;
var ObjectId =Schema.Types.ObjectId;

var CommentSchema =new Schema({
    movie:{type: ObjectId, ref:"Movie"},
    from:{type: ObjectId, ref:"User"},
    to:{type: ObjectId, ref:"User"},
    reply: [
        {
            from:{type:ObjectId,ref: "User"},
            to:{type:ObjectId,ref: "User"},
            content:String
        }
    ],
    content:String,
    meta: {
        createAt: {
            type:Date,
            default:Date.now()
        },
        updateAt: {
            type:Date,
            default:Date.now()
        }
    }
});
// pre("save") 表示每次更新存储数据都要执行一次函数
CommentSchema.pre("save", function(next) {
    if (this.isNew) {
        this.meta.createAt =this.meta.updateAt =Date.now();
    }else {
        this.meta.updateAt =Date.now();
    }
    // next()才能使流程执行下去
    next();
});
// statics静态函数，只有当模型调用时才会执行的函数
CommentSchema.statics ={
    fetch: function(cb) {
        return this
            .find({})
            .sort("meta.updateAt")
            .exec(cb)
    },
    findById: function(id, cb) {
        return this
            .findOne({_id:id})
            .exec(cb);
    }
}
// 导出模式
module.exports =CommentSchema;