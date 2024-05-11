const mongoose=require('mongoose');
const {Schema}=mongoose;

const EventSchema=new Schema({
    Name: String,
    startDate: Date,
    endDate: Date,
    Description: String,
    Location: String,
    Type: String,
    author:{
      type:Schema.Types.ObjectId,
      ref:"Admin", 
    },
    registeredUsers:{
      type:Schema.Types.ObjectId,
      ref:"User"
    }
    
});

module.exports=mongoose.model('Event',EventSchema);