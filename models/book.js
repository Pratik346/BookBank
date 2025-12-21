const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const bookSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
    },
    imageUrl:{
        type:String,
        required:true
    },
    category:{
        type:String,
        enum:[
            "Fiction","Non_Fiction","Education","Technology","Science","Comics","Children","Biography","Religion","Arts","Mathematics","Others"
        ],
        required:true
    },
    quantity:{
        type:Number,
        required:true,
    },
    reviews:[
        {
        type:Schema.Types.ObjectId,
        ref:"Review"
    }
],
owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
}
});
bookSchema.post("findOneAndDelete",async(book)=>{
    if(book){
    await Review.deleteMany({_id:{$in:book.reviews}});
    }
});
module.exports=mongoose.model("Book",bookSchema);