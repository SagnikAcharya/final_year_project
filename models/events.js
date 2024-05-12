const mongoose=require('mongoose');
const {Schema}=mongoose;

const EventSchema=new Schema({
    Name: String,
    startDate: Date,
    endDate: Date,
    Description: String,
    Location: String,
    Type: String,
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
      type:Schema.Types.ObjectId,
      ref:"User"
    }],
    count:{
      type:Number,
      default:1
    }
    
});

module.exports=mongoose.model('Event',EventSchema);