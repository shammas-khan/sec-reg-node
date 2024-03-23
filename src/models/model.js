require('dotenv').config();
const sec_key = process.env.SECRET_KEY;
const mongoose=require("mongoose");
const validator=require("validator");
const bcryptjs=require("bcryptjs");
const jwt=require("jsonwebtoken");

const registerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3
    },
    email:{
        type:String,
        required:true,
        validate(v){
            if(!validator.isEmail(v)){
                throw new Error("Invalid Email");
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:5
    },
    confirmPassword:{
        type:String,
        required:true,
        minlength:5
    },
    //we can make multiple token for one user
    //they can login throw diff device
    //so use array
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
});

//AUTH
registerSchema.methods.generateAuthToken=async function(){
    try{
        const token=await jwt.sign({_id:this._id},sec_key);
        this.tokens=this.tokens.concat({token:token});
        return token;
    }catch(e){
        console.log(e);
    }
}

//HASHING
//npm i bcryptjs
//cant use arrow function
registerSchema.pre("save",async function(next){
   //only want to encypt it when password is updated or new user come
    if(this.isModified("password")){
        // before console.log(this.password);

        this.password=await bcryptjs.hash(this.password,10);
        this.confirmPassword=this.password;//so it does not store in db

        //afterconsole.log(this.password);

        //NOW HOW TO CHECK LOGIN
    }
    next(); //MUST call for further execution
})

const Register=new mongoose.model("register",registerSchema);
module.exports=Register;