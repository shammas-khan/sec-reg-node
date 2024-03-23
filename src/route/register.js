const express=require("express");
const route=express.Router();
require("../db/conn")
const Register=require("../models/model");
const bcryptjs=require("bcryptjs");
const jwt=require("jsonwebtoken");
const auth=require("./auth"); 
const cookieParser=require("cookie-parser");
route.use(cookieParser());

route.get("/",(req,res)=>{
    res.render("index");
});

route.get("/register",(req,res)=>{
    res.render("register");
});

route.get("/login",(req,res)=>{
    res.render("login");
});

route.get("/secret",auth,(req,res)=>{
    res.render("secret");
})

route.get("/logout",auth,async(req,res)=>{
    try{
        //clear cookie from browser
        res.clearCookie('jwt');
        //clear latest from db
        req.user.tokens=req.user.tokens.filter((curEle=>{
            return curEle.token!==req.token;
        }));

        //clear all
        //req.user.tokens=[];
        
        await req.user.save();
        res.render("login");
    }catch(e){
        res.status(500).send(e)
    }
});

//Secure login
//before saving we want we use hashing (hashing vs encryption)
//se we use pre method of mongoose scheme
//check models/model.js

route.post("/register",async(req,res)=>{
    try{
        const pass=req.body.password;
        const c_pass=req.body.confirmPassword;
    if(pass!=c_pass){
        res.send("Password does not match!");
    }
    else{
        const data={
            name:req.body.name,
            email:req.body.email,
            password:pass,
            confirmPassword:pass
        }
        const user=Register(data);
        //AUTHENTICATION
        const token=await user.generateAuthToken();

        res.cookie("jwt",token,{
            expires:new Date(Date.now()+30000),
            httpOnly:true//use has no authorization now
        });
        
        await user.save();
        res.send("user register");
    }
    }catch(e){
        res.status(500).send(e);
    }
});

route.post("/login",async(req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
        //const user=await Register.find({$and:[{email},{password}]})//object destructuring
        //console.log(email,password,user.length);

        const user=await Register.findOne({email});
        const isMatch=await bcryptjs.compare(password,user.password);
        res.status(201);

           //create token
           const token=await user.generateAuthToken();

           //generate cokies
           res.cookie("jwt",token,{
               expires:new Date(Date.now()+30000),
               httpOnly:true
           });

        if(isMatch){
            res.render("secret")
        }
        else{
            res.send("Invalid User")
          }
    }catch(e){
        res.status(404).send(e);
    }
 
})

module.exports=route;