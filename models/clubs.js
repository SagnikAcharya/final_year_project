const mongoose=require('mongoose');
const {Schema}=mongoose;

const clubSchema=new Schema({
    Name: String,
    description  : Number,
    event:[{
        type:Schema.Types.ObjectId,
        ref:"events"
    }]
})

module.exports=mongoose.model('Club',clubSchema);