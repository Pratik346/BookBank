require("dotenv").config();
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const mongourl=process.env.ATLASDB_URL;
const path=require("path");
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
const bookRouter=require("./routes/book.js");
const reviewRouter=require("./routes/review.js");
const session=require("express-session");
const MongoStore=require("connect-mongo").default;
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const userRouter=require("./routes/user.js");
const userDetails=require("./routes/userdetails.js");
main()
.then(()=>{
    console.log("Connected to database");
})
.catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect(mongourl);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"public")));
const store=MongoStore.create({
    mongoUrl:mongourl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
});
store.on("error",(err)=>{
    console.log("Error in mongosession store",err);
});
const sessionoptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() +1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true
    }
};
app.use(session(sessionoptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.successmsg=req.flash("success");
    res.locals.errormsg=req.flash("error");
    res.locals.curruser=req.user;
    next();
});

app.get("/",(req,res)=>{
    res.render("book/home.ejs");
});
app.use("/book",bookRouter);
app.use("/book/:id/reviews",reviewRouter);
app.use("/user",userDetails);
app.use("/",userRouter);
app.use((err,req,res,next)=>{
    let {status=500,message="Some Error Occurred"}=err;
    res.status(status).render("error.ejs",{status,message});
});
app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
});