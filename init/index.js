const mongoose= require("mongoose");
const initdata=require("./data.js");
const book=require("../models/book.js");
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/BookLibrary");
}
main()
.then(()=>{
    console.log("connected to database");
})
.catch((err)=>{
    console.log(err);
});
const initdb=async()=>{
    await book.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"693d443c1f6b6b0ef05bb33a"}));
    await book.insertMany(initdata.data);
    console.log("Saved to Database");
}
initdb();