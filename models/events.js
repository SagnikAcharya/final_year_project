const mongoose=require('mongoose');
const {Schema}=mongoose;

const ImageSchema=new Schema({
      url:String,
      filename:String
})

ImageSchema.virtual('thumbnail') .get(function(){
  this.url.replace('/upload','/upload/w_200');
});

const EventSchema=new Schema({
    Name: String,
    startDate: Date,
    endDate: Date,
    Description: String,
    Location: String,
    Type: String,
    images:[ImageSchema],
    deleteImages:[],
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