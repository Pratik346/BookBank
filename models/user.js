const { required } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportlocalMongoose=require("passport-local-mongoose");
const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },
    contactno:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true,
    },
    dateofbirth:{
        type:String,
        required:true
    },
    bloodgroup:{
        type:String,
        required:true,
    },
    nationality:{
        type:String,
        required:true
    }
});
userSchema.plugin(passportlocalMongoose.default || passportlocalMongoose);
module.exports=mongoose.model("User",userSchema);