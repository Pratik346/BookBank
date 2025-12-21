const books=require("./models/book");
const Review=require("./models/review");
module.exports.isLoggedin=(req,res,next)=>{
        if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","Please Signup/Login");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveredirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner=async (req,res,next)=>{
        let {id}=req.params;
        let book=await books.findById(id);
        if(!(book.owner._id.equals(res.locals.curruser._id))){
        req.flash("error","Only Owner can Edit/Delete");
        return res.redirect(`/book/${id}`);
    }
    next();
}
module.exports.isauthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.curruser._id)){
        req.flash("error","Only Author can Delete");
        return res.redirect(`/book/${id}`);
    }
    next();
}