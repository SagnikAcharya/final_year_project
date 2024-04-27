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
      ref:"User"
    },
    // geocodes: {
    //     type: {
    //       type: String, 
    //       enum: ['Point'],
    //       required: false,
    //     },
    //     coordinates: {
    //       type: [Number],
    //       required: true
    //     }
    //   },
      // club:{
      //   type:Schema.Types.ObjectId,
      //   ref:"clubs"
      // }
});

module.exports=mongoose.model('Event',EventSchema);