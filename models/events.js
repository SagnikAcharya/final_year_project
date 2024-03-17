const mongoose=require('mongoose');
const {Schema}=mongoose;

const ImageSchema=new Schema({
    url: String,
    filename: String
})

const EventSchema=new Schema({
    eventName: String,
    eventDate: Date,
    geocodes: {
        type: {
          type: String, 
          enum: ['Point'],
          required: false
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
      description: String,
      location: String,
      author:{
        type:Schema.Types.ObjectId,
        ref:"user"
      },
});

module.exports=mongoose.model('Event',UserSchema);