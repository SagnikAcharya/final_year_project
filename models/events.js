const mongoose=require('mongoose');
const {Schema}=mongoose;

const EventSchema=new Schema({
    Name: String,
    startDate: Date,
    endDate: Date,
    Description: String,
    Location: String,
    Type: String,
    images:[{
      url:String,
      filename:String
    }],
    limit:{
      type:Number,
      require:true,
      default:2,
    },
    author:{
      type:Schema.Types.ObjectId,
      ref:"Admin", 
    },
    registeredUsers:[{
      id:{
          type:Schema.Types.ObjectId,
          ref:"User",
      },isVerified:{
            type:Number,
            default:1,
            require:true
      }
    }],
    count:{
      type:Number,
      default:1
    }
    
});

module.exports=mongoose.model('Event',EventSchema);