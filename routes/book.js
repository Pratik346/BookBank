const express=require("express");
const router=express.Router();
const books=require("../models/book");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {bookSchema}=require("../schema.js");
const {isLoggedin, isOwner}=require("../middleware.js");
const allowedCategories = [
    "Fiction",
    "Non_Fiction",
    "Education",
    "Technology",
    "Science",
    "Comics",
    "Children",
    "Biography",
    "Religion",
    "Arts",
    "Mathematics",
    "Others"
  ];
  
const validatebook=(req,res,next)=>{
    let {error}=bookSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}
router.get("/",wrapAsync(async(req,res)=>{
    const {category}=req.query;
    let allbooks;
    if(category){
         allbooks=await books.find({category});
    }else{
        allbooks=await books.find({});
    }
    res.render("book/index.ejs",{allbooks,category});
}));
router.get("/new",isLoggedin,(req,res)=>{
    res.render("book/new.ejs");
});
router.get("/search",wrapAsync(async(req,res)=>{
    try{
        const search=req.query.search;
        let allbooks=search?await books.find({title:{$regex:search,$options:"i"}}):await books.find({});
        res.render("book/index.ejs",{allbooks});
    }catch(err){
        console.log(err);
        req.flash("error","Some error occurred");
        res.redirect("/book");
    }
}));
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const book=await books.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!book){
        req.flash("error","Book does not exist!");
        return res.redirect("/book");
    }
    res.render("book/show.ejs",{book});
}));
router.post("/",validatebook,wrapAsync(async(req,res)=>{
    if(!req.body || Object.keys(req.body).length===0){
        throw new ExpressError(400,"Please send valid data");
    }
    if (!allowedCategories.includes(req.body.category)) {
        throw new ExpressError(400, "Invalid book category");
      }
    const newbook=new books(req.body);
    newbook.owner=req.user._id;
    await newbook.save();
    req.flash("success","Book Added Successfully");
    res.redirect("/book");
}));
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const book=await books.findById(id);
    if(!book){
        req.flash("error","Book does not exist!");
        return res.redirect("/book");
    }
    res.render("book/edit.ejs",{book});
}));
router.put("/:id",isLoggedin,isOwner,validatebook,wrapAsync(async(req,res)=>{
    let {id}=req.params;
     if(!req.body || Object.keys(req.body).length===0){
        throw new ExpressError(400,"Please send valid data");
    }
    await books.findByIdAndUpdate(id,{...req.body});
    req.flash("success","Book Updated");
    res.redirect(`/book/${id}`);
}));
router.delete("/:id",isLoggedin,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await books.findByIdAndDelete(id);
    req.flash("success","Book deleted successfully");
    res.redirect("/book");
}));
module.exports=router;