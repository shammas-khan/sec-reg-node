const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/registerDB")
.then(()=>{console.log("connection successful!")})
.catch((e)=>{console.log("connetion failure",e)})