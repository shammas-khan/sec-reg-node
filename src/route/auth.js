const Register=require("../models/model")
const jwt=require("jsonwebtoken");
const sec_key=process.env.SECRET_KEY;
const auth=async(req,res,next)=>{
    try{
        //check user is login
        const token=req.cookies.jwt;
        const verifyUser=await jwt.verify(token,sec_key);//return the token of that key and payload
        const user=await Register.findOne({_id:verifyUser._id});
        
        //req the token so that other can use see lec5

        req.user=user;
        req.token=token;
        next();
    }catch(e){
        res.status(404).render("login");
    }
   
}
module.exports=auth;