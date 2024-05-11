const mongoose=require('mongoose');
Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

const AdminSchema=new Schema({
    department:String,
    mobile:String,
    experience:Number,
    admin_id:{
        type:Number,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        sparse:true
    },
    clubs : [{
            club : String,
         }],
    isAdmin:{
        type:Boolean,
        required:true,
        default:true,
    },
    QR:{
        type:String,
        unique:true
    }
});
AdminSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('Admin',AdminSchema);