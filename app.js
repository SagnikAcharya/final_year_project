const express = require("express");
const path = require("path");
const methodOverride = require("method-override");    //used for parsing json
const ejsMate = require("ejs-mate");   //templating engine


const app=express();
app.use(express.urlencoded({ extended: true }));   //data converted from urlencoded to json
app.use(methodOverride("_method"));                 // used for Put/Patch(Update) on html forms
app.use(express.static(path.join(__dirname,'public')));  


app.engine("ejs", ejsMate);   //templating engine 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.get("/",(req,res)=>{
    res.render("./boilerplate");    //rendering boilerplate.ejs on port 8080 for '127.0.0.1:8080' path
    // res.send("Working Properly");
})


app.listen(8080,()=>{
    console.log("Server running successfully on port 8080 ....");
})