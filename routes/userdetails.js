const express=require("express");
const router=express.Router();
const books=require("../models/book");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedin}=require("../middleware.js");
router.get("/details/:id" ,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let book=await books.findById(id).populate("owner");
    if(!book){
        req.flash("error","Book not found");
        return res.redirect("/book");
    }

    res.render("user/userdetails.ejs",{book});
}));
router.get("/mybooks",isLoggedin,wrapAsync(async(req,res)=>{
    try{
        const mybooks=await books.find({owner:res.locals.curruser._id});
        res.render("book/mybook.ejs",{mybooks});
    }catch(err){
        req.flash("error","No books found");
        res.redirect("/book");
    }
}));
module.exports=router;