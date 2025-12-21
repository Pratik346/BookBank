const express=require("express");
const router=express.Router({mergeParams:true});
const books=require("../models/book");
const wrapAsync=require("../utils/wrapAsync.js");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review");
const {isLoggedin, isauthor}=require("../middleware.js");
const validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}
router.post("/",isLoggedin,validatereview,wrapAsync(async(req,res)=>{
    let book=await books.findById(req.params.id);
    let newreview=new Review(req.body);
    book.reviews.push(newreview);
    newreview.author=req.user._id;
    await newreview.save();
    await book.save();
    req.flash("success","New Review Added");
    res.redirect(`/book/${book._id}`);
}));
router.delete("/:reviewId",isLoggedin,isauthor,wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await books.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/book/${id}`);

}));
module.exports=router;