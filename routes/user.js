const express=require("express");
const passport=require("passport");
const router=express.Router();
const User=require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const { saveredirectUrl } = require("../middleware");
router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
});
router.post("/signup",wrapAsync(async(req,res)=>{
    try{
    let {username,email,contactno,address,dateofbirth,bloodgroup,nationality,password}=req.body;
    const newuser=new User({username,email,contactno,address,dateofbirth,bloodgroup,nationality});
    await User.register(newuser,password);
    req.login(newuser,(err)=>{
        if(err){
            return next(err);
        }
    req.flash("success","Welcome to BookBank");
    res.redirect("/book");
    });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));
router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
});
router.post("/login",saveredirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
    req.flash("success","Welcome To BookBank!");
    res.redirect("/book");
});
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged Out Successfully");
        res.redirect("/book");
    });
});
module.exports=router;