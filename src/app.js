require("dotenv").config();
const express=require("express");
const app=express();
const port=process.env.PORT || 3000;
const Register=require("./route/register");
const path=require("path");
const hbs=require("hbs");



const publicPath=path.join(__dirname,"../public");
const partialPath=path.join(__dirname,"../templates/partials");
const viewsPath=path.join(__dirname,"../templates/views");

app.use(express.static(publicPath));

app.set("view engine","hbs");
app.set("views",viewsPath);
hbs.registerPartials(partialPath);

app.use(express.json());
app.use(express.urlencoded({extended:false}));//so that we can get the data of post throw form (it is not json like postman)

app.use(Register);

app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
})