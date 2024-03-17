const express = require("express");
const path = require("path");
const methodOverride = require("method-override");    //used for parsing json
const ejsMate = require("ejs-mate");   //templating engine
const mongoose = require("mongoose");
const session = require('express-session');
const flash = require("connect-flash");
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');


const app=express();

app.use(express.urlencoded({ extended: true }));  //data converted from urlencoded to json

app.use(methodOverride("_method"));                 // used for Put/Patch(Update) on html forms
app.use(express.static(path.join(__dirname,'public')));  


app.engine("ejs", ejsMate);   //templating engine 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionConfig={
    secret : 'secret',
    resave: true,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        expires : Date.now() +1000*60*60*24*7,
        maxAge : 1000*60*60*24*7
    }
};

const isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        return res.redirect('/');
    }
    next();
}

app.use(session(sessionConfig));
app.use(flash());

mongoose.connect('mongodb://127.0.0.1:27017/fivers');

const db=mongoose.connection;
db.on("error",console.error.bind(console,'connection error'));
db.once("open",()=>{
    console.log("Database Connected");
});




app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
  })



app.get("/",(req,res)=>{
    res.render("./boilerplate");    //rendering boilerplate.ejs on port 8080 for '127.0.0.1:8080' path
    // res.send("Working Properly");
})

app.get('/register',(req,res)=>{
    res.render("./register");
})

app.post('/register', async(req,res)=>{
    const {email,username,password}=req.body;
    const usernew=new User({email,username});
    const registereduser=await User.register(usernew,password);
    req.login(registereduser, function(err) {
        if (err) { return next(err); }
        return res.redirect('/');
      });
})

app.get('/login',(req,res)=>{
    res.render("./login");
})

app.post('/login',passport.authenticate('local',{failureMessage: true , failureRedirect:'/login',keepSessionInfo: true}), (req,res)=>{
    req.flash('success',`Welcome back ${req.user.username}`);
    res.redirect("/");
})

app.get('/logout',(req,res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success',"Logged Out Successfully");
        res.redirect('/');
      });
})

app.get('/dashboard',(req,res)=>{
    res.render('./dashboard/dashboard.ejs');
})


app.listen(8080,()=>{
    console.log("Server running successfully on port 8080 ....");
})