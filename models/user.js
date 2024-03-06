const mongoose=require('mongoose');
Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

const UserSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        required: true
    }
});
UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',UserSchema);