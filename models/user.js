const mongoose=require('mongoose');
Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

const UserSchema=new Schema({
    department:String,
    mobile:String,
    year:String,
    roll:{
        type:String,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    clubs : [{
            club : String,
         }],
    isAdmin:{
        type:Boolean,
        required:true,
        default:true,
    }
});
UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',UserSchema);