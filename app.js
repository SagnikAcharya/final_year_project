if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}
const dbURL=process.env.DB_URL;

const express = require("express");
const path = require("path");
const methodOverride = require("method-override");    //used for parsing json
const ejsMate = require("ejs-mate");   //templating engine
const mongoose = require("mongoose");
const session = require('express-session');
const flash = require("connect-flash");
const passport=require('passport');
const LocalStrategy=require('passport-local');
const { MongoClient, ServerApiVersion } = require('mongodb');
const User=require('./models/user');
const Club=require('./models/clubs');
const Event=require('./models/events');
const flatpickr = require("flatpickr");
const {catchAsync}=require('./middleware.js');
const {isLoggedIn}=require('./middleware.js');
const MongoStore = require('connect-mongo');
const QRCode = require('qrcode');


// const { Calendar } = require('@fullcalendar/core');
// const interactionPlugin = require('@fullcalendar/interaction');
// const dayGridPlugin = require('@fullcalendar/daygrid');

// const calendarEl = document.getElementById('calendar');
// const calendar = new Calendar( {
//   plugins: [
//     interactionPlugin,
//     dayGridPlugin
//   ],
//   initialView: 'dayGridMonth',
//   editable: true, // important for activating event interactions!
//   selectable: true, // important for activating date selectability!
//   events: [
//     { title: 'Meeting', start: new Date() }
//   ]
// })

// calendar.render()



const app=express();

app.use(express.urlencoded({ extended: true }));  //data converted from urlencoded to json

app.use(methodOverride("_method"));                 // used for Put/Patch(Update) on html forms
app.use(express.static(path.join(__dirname, "public")));


app.engine("ejs", ejsMate);   //templating engine 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));






mongoose.connect('mongodb://127.0.0.1:27017/fivers');

const db=mongoose.connection;
db.on("error",console.error.bind(console,'connection error'));
db.once("open",()=>{
    console.log("Database Connected");
});

//   const store = new MongoStore({
//     mongoUrl: dbURL,
//     secret:'secret',
//     touchAfter : 24*3600,
//   })
//   store.on("error",function (e){
//     console.log("Connection Error");
//   })
  
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

app.use(session(sessionConfig));
app.use(flash());



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
    res.render("./templates/register");
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
    res.render("./templates/login");
})

app.post('/login',passport.authenticate('local',{failureMessage: true , failureRedirect:'/',keepSessionInfo: true}), (req,res)=>{
    const redirectUrl=req.session.returnTo || '/';
    delete req.session.returnTo;
    req.flash('success',`Welcome back ${req.user.username}`);
    res.redirect(redirectUrl);
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

app.get('/artCLub',(req,res)=>{
    res.render('./clubs/artClub.ejs');
})


/////////
app.post('/artClub', async(req,res)=>{
    const {memberName,memberId,selectedDate}=req.body;
    const usernew=new Club({memberName,memberName,selectedDate});
    const newUser=await usernew.save()
    console.log(newUser);
    res.send(req.body);
    
})
////////

app.get('/event', async(req,res)=>{
    const event=await Event.find({});
    res.render('./templates/allEvents.ejs',{event});
})

app.get('/addevent',(req,res)=>{
    res.render('./templates/addEvent.ejs');
})

app.post('/addEvent',async(req,res)=>{
    const events=new Event(req.body.event);
    const newEvent=await events.save();
    req.flash('success','Successfully added a new event');
    res.redirect(`/event/${newEvent._id}`);
})

app.get('/event/:id', async(req,res)=>{
    const event=await Event.findById(req.params.id);
    res.render('./templates/eventPage.ejs',{event});
})

app.get('/event/:id/edit',isLoggedIn,async(req,res)=>{
    const event=await Event.findById(req.params.id);
    res.render('./templates/editEvent.ejs',{event});
})

app.put('/event/:id',async(req,res)=>{
    const event=await Event.findByIdAndUpdate(req.params.id,{...req.body.event});
    req.flash('success','Event details updated successfully');
    res.redirect(`/event/${event._id}`);
})

app.delete('/event/:id',async(req,res)=>{
    await Event.findByIdAndDelete(req.params.id);
    req.flash('error','Event deleted');
    res.redirect('/event');
})

app.get('/user/:id',async(req,res)=>{
    const newUser=await User.findById(req.params.id);
    QRCode.toDataURL(newUser.username,(err,src)=>{
        res.render('./templates/userProfile.ejs',{user:newUser,qr_code:src});
    });
})
app.get('/addStudent',async(req,res)=>{
    res.render('./adminSection/addStudent.ejs');
})

app.post('/addStudent',async(req,res)=>{
    const users=new User(req.body.user); 
    const newUser=await users.save();
    req.flash('success','Successfully added a new user');
    res.redirect(`/user/${newUser._id}`);
})

app.get('/allStudents', async(req,res)=>{
    const users=await User.find({});
    let i=1;
    res.render('./adminSection/allStudents.ejs',{users,i});
})
app.post('/user/:id', async(req,res)=>{
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/allStudents');
})

app.get('/user/:id/edit',isLoggedIn,async(req,res)=>{
    const users=await User.findById(req.params.id);
    res.render('./adminSection/editUser.ejs',{user:users});
})
app.put('/user/:id', async(req,res)=>{
    const event=await Event.findByIdAndUpdate(req.params.id,{...req.body.user});
    req.flash('error','Deleted');
    res.redirect('/allStudents');
})

// app.get("*", (req, res, next) => {
//     next(new ExpressError("Not Found", 404));
//   });
  
//   app.use((err, req, res, next) => {
//     const { statusCode = 500,message='Something went wrong' } = err;
//     res.status(statusCode).render("./templates/error_404.ejs", { err });
//   });

app.listen(8080,()=>{
    console.log("Server running successfully on port 8080 ....");
})