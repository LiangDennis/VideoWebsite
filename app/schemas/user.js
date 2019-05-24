var mongoose =require("mongoose");
var bcrypt =require("bcryptjs");
var SALT_WORK_FACTOR =10;//盐的长度

var UserSchema =new mongoose.Schema({
    name: {
        unique:true,
        type:String
    },
    password: String,
    //user,admin,super admin
    // 用number，数字大写来决定
        // 0:nomal user
        // 1:verified user 
        // 2:professional user
        // >10 :admin
        // >50 :super admin
    role: {
        type:Number,
        default:0
    },
    // password: {
    //     type:String
    // },
    meta: {
        createAt: {
            type:Date,
            default:new Date("1/2/2000")
        },
        updateAt: {
            type:Date,
            default:new Date("1/2/2000")
        }
    }
});
// pre("save") 表示每次更新存储数据都要执行一次函数，更新时间 ,false表示关闭窗口再将数据存入数据库
UserSchema.pre("save",false, function(next) {
    var user =this;
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if(err) return next(err);
        
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err);

            user.password =hash;
            // console.log(salt);
            // console.log(user.password);
            next();
        } )
    })
    // console.log("我是在保存数据之前执行的！");
    
    
    if (this.isNew) {
        this.meta.createAt =this.meta.updateAt =Date.now();
    }else {
        this.meta.updateAt =Date.now();
    }

    // 将密码hash并加盐
    

    // next()才能使流程执行下去
    next();
});

// 实例方法，只有当实例才能调用的方法，cb是callback回调函数
UserSchema.methods ={
    comparePassword:function(_password, cb) {
        // bcrypt.compare(_password, this.password, function(err, isMatch) {
        //     if (err) return cb(err);
        //     cb(null, isMatch);
        // });
        // 由于实现pre save出现问题，直接判断password字符串是否相等
        var isMatch =false;
        if(_password ===this.password) {
            isMatch =true;
        } 
        cb(null, isMatch);
    }
};


// statics静态函数，只有当模型调用时才会执行的函数
UserSchema.statics ={
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
module.exports =UserSchema;