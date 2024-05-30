if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}
const dbURL=process.env.DB_URL;

const nodemailer = require('nodemailer');
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");    //used for parsing json
const ejsMate = require("ejs-mate");   //templating engine
const mongoose = require("mongoose");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport=require('passport');
const LocalStrategy=require('passport-local');
const { MongoClient, ServerApiVersion } = require('mongodb');
const User=require('./models/user');
const Admin=require('./models/admin');
const Club=require('./models/clubs');
const Event=require('./models/events');
const flatpickr = require("flatpickr");
const {catchAsync}=require('./middleware.js');
const {isLoggedIn,isAdmin,validateEvent,validateUser}=require('./middleware.js');
const QRCode = require("qrcode");
const multer = require("multer");
const { storage, cloudinary } = require("./Cloudinary/cloudinaryIndex.js");
const upload = multer({ storage });
const moment = require("moment");
const mongoSanitize = require("express-mongo-sanitize");







///////////NODEMAILER

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "unofficialfivers@gmail.com",
    pass: "ptri mnud tgzs uqfe",
  },
});

//////////////////////////////////

const app = express();

app.use(express.urlencoded({ extended: true })); //data converted from urlencoded to json

app.use(methodOverride("_method")); // used for Put/Patch(Update) on html forms
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());

app.engine("ejs", ejsMate); //templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


///////////////////////////////////////////////////   MONGODB/DATABASE CONNECTION     ///////////////////////////////////////////////
mongoose.connect(dbURL, {});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database Connected");
});

///////////////////////////////////////////////////   SESSION CONFIG     ///////////////////////////////////////////////

const mongoClientPromise = new Promise((resolve) => {
  mongoose.connection.on("connected", () => {
      const client = mongoose.connection.getClient();
      resolve(client);
  });
});

const sessionStore = MongoStore.create({
  clientPromise: mongoClientPromise,
  dbName: "myDb",
  collection: "sessions"
});
const sessionConfig = {
  secret: "secret",
  store: sessionStore,
  name: "ems2K24",
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());
















///////////////////////////////////////////////////   PASSPORT JS FOR LOGIN/REGISTER      ///////////////////////////////////////////////

app.use(passport.initialize());
app.use(passport.session());
passport.use("student", new LocalStrategy(User.authenticate()));
passport.use("admin", new LocalStrategy(Admin.authenticate()));

///////////////////////////////////////////////////  SERIALIZE AND DESERIALIZE USER TO SESSION      ///////////////////////////////////////////////

passport.serializeUser((obj, done) => {
  if (obj instanceof Admin) {
    done(null, { id: obj._id, type: "Admin" });
  }
  if (obj instanceof User) {
    done(null, { id: obj.id, type: "User" });
  }
});

passport.deserializeUser((obj, done) => {
  if (obj.type === "User") {
    User.findById(obj.id).then((student) => done(null, student));
  }
  if (obj.type === "Admin") {
    Admin.findById(obj.id).then((admin) => done(null, admin));
  }
});

///////////////////////////////////////////////////   SESSION VARIABLES      ///////////////////////////////////////////////

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// passport.serializeUser(Admin.serializeUser());
// passport.deserializeUser(Admin.deserializeUser());

//////////////////////NODEMAILER/////////////

app.post("/contact", async (req, res) => {
  const { fullname, email, phone, subject, message } = req.body;
  const sendMail = "fivers2024@gmail.com";
  const mailOptions = {
    from: "unofficialfivers@gmail.com", // sender address
    to: "fivers2024@gmail.com", // list of receivers
    subject: `Contact Form Submission: ${subject}`, // Subject line
    text:
      `You have received a new message from your website contact form.\n\n` +
      `Here are the details:\n\n` +
      `Name: ${fullname}\n\n` +
      `Email: ${email}\n\n` +
      `Phone: ${phone}\n\n` +
      `Message: ${message}\n\n`,
    html: `<p>You have received a new message from your website contact form.</p>
               <h3>Contact Details</h3>
               <ul>
                   <li>Name: ${fullname}</li>
                   <li>Email: ${email}</li>
                   <li>Phone: ${phone}</li>
               </ul>
               <h3>Message</h3>
               <p>${message}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    req.flash("success", "Your message has been sent successfully.");
    res.redirect("/home"); // redirect to a thank you page or back to the form
  } catch (error) {
    console.log(error);
  }
});

///////////////////////////////////////////////////   COVER ROUTE      ///////////////////////////////////////////////

app.get("/", async (req, res) => {
  const event = await Event.find({});
  res.render("./cover", { event }); //rendering boilerplate.ejs on port 8080 for '127.0.0.1:8080' path
});

///////////////////////////////////////////////////   HOME ROUTE      ///////////////////////////////////////////////

app.get("/home", async (req, res) => {
  const event = await Event.find({});
  res.render("./boilerplate", { event }); //rendering boilerplate.ejs on port 8080 for '127.0.0.1:8080' path
});

///////////////////////////////////////////////////   ADMIN REGISTER AND LOGIN      ///////////////////////////////////////////////

app.get("/register", (req, res) => {
  res.render("./templates/register"); //register Admin(GET)
});

app.post("/register", validateUser, async (req, res, next) => {
  //Register Admin(POST)
  const { password } = req.body;
  const newadmin = new Admin(req.body);
  const registeredAdmin = await Admin.register(newadmin, password);
  newadmin.QR = newadmin.username.trim() + "_" + newadmin.admin_id;
  await newadmin.save();
  req.login(registeredAdmin, function (err) {
    if (err) {
      return next(err);
    }
    return res.redirect(`/admin/${newadmin._id}`);
  });
});

app.get("/adminLogin", (req, res) => {
  //Login Admin(GET)
  res.render("./templates/adminLogin");
});

app.post(
  "/adminLogin",
  passport.authenticate("admin", {
    failureFlash: true,
    failureRedirect: "/adminLogin",
    keepSessionInfo: true,
  }),
  (req, res, err) => {
    //Login Admin(POST)
    const redirectUrl = req.session.returnTo || "/home";
    delete req.session.returnTo;
    req.flash("success", `Welcome back ${req.user.username}`);
    res.redirect(redirectUrl);
  }
);

///////////////////////////////////////////////////   STUDENT REGISTER AND LOGIN      ///////////////////////////////////////////////

app.get("/addStudent", isLoggedIn, isAdmin, async (req, res) => {
  //Register Student(GET)
  res.render("./adminSection/addStudent.ejs");
});

app.post("/addStudent", isAdmin, async (req, res) => {
  //Register Student(POST)
  const { password } = req.body;
  const student = new User(req.body);
  await User.register(student, password);
  student.QR = student.username.trim() + "_" + student.roll;
  await student.save();
  req.flash(
    "success",
    "Successfully added a new student : " + student.username
  );
  res.redirect(`/allStudents`);
});

app.get("/studentLogin", (req, res) => {
  //Login Student(GET)
  res.render("./templates/studentLogin");
});

//Login Student(POST)
app.post(
  "/studentLogin",
  passport.authenticate("student", {
    failureFlash: true,
    failureRedirect: "/studentLogin",
    keepSessionInfo: true,
  }),
  (req, res, err) => {
    const redirectUrl = req.session.returnTo || "/home";
    delete req.session.returnTo;
    req.flash("success", `Welcome back ${req.user.username}`);
    res.redirect(redirectUrl);
  }
);

///////////////////////////////////////////////////   LOGOUT      ///////////////////////////////////////////////

app.get("/logout", (req, res) => {
  // delete req.locals.currentUser;
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged Out Successfully");
    res.redirect("/home");
  });
});

///////////////////////////////////////////////////   EVENTS      ///////////////////////////////////////////////

app.get("/event", async (req, res) => {
  //All Events Page
  const event = await Event.find({});
  res.render("./templates/allEvents.ejs", { event });
});

app.get("/addevent", isLoggedIn, isAdmin, (req, res) => {
  //Add a new Event
  res.render("./templates/addEvent.ejs");
});

app.post(
  "/addEvent",
  isLoggedIn,
  isAdmin,
  upload.array("image"),
  async (req, res) => {
    //Add a new Event
    const events = new Event(req.body.event);
    const newuser = await Admin.find({ username: req.user.username });
    events.images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    events.author = newuser[0]._id;
    const newEvent = await events.save();
    newEvent.moment_Date = moment(newEvent.EventDate).format("Do MMMM YYYY");
    newEvent.moment_Time = moment(newEvent.EventDate).format("h:mm a");
    await newEvent.save();
    req.flash("success", "Successfully added a new event");
    res.redirect(`/event/${newEvent._id}`);
  }
);

app.get('/event/:id', async(req,res)=>{                          //View Specific Event
    const event=await Event.findById(req.params.id);
    const author=await Admin.findById(event.author);
    res.render('./templates/eventPage.ejs',{event,author});
})

app.get('/event/:id/edit',isLoggedIn,isAdmin,async(req,res)=>{             //Edit Specific Event(GET)
    const event=await Event.findById(req.params.id);
    // const date=moment(`${event.startDate}`).utc().format('MMMM Do YYYY, h:mm:ss a');
    res.render('./templates/editEvent.ejs',{event});
})

app.put('/event/:id',isLoggedIn,isAdmin,validateEvent,upload.array('image'),async(req,res)=>{
    const event=await Event.findByIdAndUpdate(req.params.id,{...req.body.event});   //Edit Specific Event(POST)
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}));
    event.images.push(...imgs);    
    await event.save();
    event.moment_Date=moment(event.EventDate).format('Do MMMM YYYY');
    event.moment_Time=moment(event.EventDate).format('h:mm a');
    await event.save();
    console.log(req.body);
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await event.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    req.flash('success','Event details updated successfully');
    res.redirect(`/event/${event._id}`);
})

app.delete('/event/:id',isLoggedIn,isAdmin,async(req,res)=>{                           //Delete Specific Event
    await Event.findByIdAndDelete(req.params.id);
    req.flash('error','Event deleted');
    res.redirect('/event');
})


app.post('/registerEvent/:id',async(req,res)=>{
    const {id}=req.params;
    const event=await Event.findById(id);
    const registerUser=await User.find({username:req.user.username});
    await event.registeredUsers.push(registerUser[0]._id);
    if(event.limit>=event.count){
        event.count++;
    }else{
        req.flash('error','Sorry, Maximum limit of registrations reached');
        res.redirect(`/event/${id}`);
    }
    await event.save();
    req.flash('success','Successfully Registered');
    res.redirect(`/event/${id}`);
})

app.get('/scanQR/:id',(req,res)=>{  
    const {id}=req.params;                    
    res.render("./adminSection/scanQR",{id});
})
app.post('/checkQR/:id',async(req,res)=>{   
    let {id}=req.params;
    let {eventid}=req.body;
    const event=await Event.findById(eventid);
    const user=await User.find({QR:`${id}`});
    for(let i in event.registeredUsers){
        if(event.registeredUsers[i]._id.equals(user[0]._id)){
            event.registeredUsers[i].isVerified=true;
            await event.save();
            req.flash('success','User successfully verified');
            res.redirect(`/verifiedStudents/${event._id}`);         
        }
    }
})  


app.get('/verifiedStudents/:id',async(req,res)=>{
    const {id}=req.params;
    const event=await Event.findById(id);
    let users=new Array();
    for(let i in event.registeredUsers){
        if(event.registeredUsers[i].isVerified==true){
            let user=await User.findById(event.registeredUsers[i]._id);
            users.push(user);
        }else{
            res.render('./adminSection/verifyStudent.ejs',{users,i,event});
            return res.redirect(`/event/${id}`);
        }
    }
    let i=1;
    res.render('./adminSection/verifyStudent.ejs',{users,i,event});
})


///////////////////////////////////////////////////   USER      ///////////////////////////////////////////////


app.get('/allStudents',isLoggedIn,isAdmin,async(req,res)=>{                                   // View all Students
    const users=await User.find({});
    let i=1;
    res.render('./adminSection/allStudents.ejs',{users,i});
})

app.get('/user/:id',isLoggedIn,async(req,res)=>{                                                    //View Specific User/Student
    const newUser=await User.findById(req.params.id);
    QRCode.toDataURL(newUser.QR,(err,src)=>{                       //Send QR
        res.render('./templates/userProfile.ejs',{user:newUser,qr_code:src});
    });
})

app.get('/user/:id/edit',isLoggedIn,isAdmin,async(req,res)=>{                                   //Edit Specific Student
    const users=await User.findById(req.params.id);
    res.render('./adminSection/editUser.ejs',{user:users});
})
app.put('/user/:id',isLoggedIn,isAdmin, async(req,res)=>{                                                  //Edit Specific Student(POST)
    await User.findByIdAndUpdate(req.params.id,{...req.body.user});
    req.flash('error','Deleted');
    res.redirect('/allStudents');
})

app.post('/user/:id',isLoggedIn,isAdmin,async(req,res)=>{                                                     //Delete Specific Student
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/allStudents');
})





///////////////////////////////////////////////////   ADMIN      ///////////////////////////////////////////////

app.get('/admin/:id',isAdmin,isLoggedIn, async(req,res)=>{                                                     //View Specific Admin
    const admin=await Admin.findById(req.params.id);
    const event=await Event.find({}).lean();
    QRCode.toDataURL(admin.QR,(err,src)=>{                       //Send QR
        res.render('./adminSection/adminDashboard.ejs',{admin,event,qr_code:src});
    });
})




///////////////////////////////////////////////////   CLUBS      ///////////////////////////////////////////////

app.get('/artCLub',async(req,res)=>{     
    const event=await Event.find({});                                              //ART Club Get Route      
    res.render('./clubs/artClub.ejs',{event});
})
app.get('/photoClub',async(req,res)=>{    
    const event=await Event.find({});                                               //Photography Club Get Route      
    res.render('./clubs/photoClub.ejs',{event});
})
app.get('/literaryClub',async(req,res)=>{   
    const event=await Event.find({});                                                //Photography Club Get Route      
    res.render('./clubs/literaryClub.ejs',{event});
})
app.get('/flimClub',async(req,res)=>{     
    const event=await Event.find({});                                              //Talkies Club Get Route      
    res.render('./clubs/flimClub.ejs',{event});
})
app.get('/hikingClub',async(req,res)=>{     
    const event=await Event.find({});                                              //Hiking Club Get Route      
    res.render('./clubs/hikingClub.ejs',{event});
})
app.get('/musicClub',async(req,res)=>{     
    const event=await Event.find({});                                              //Hridmajhare Club Get Route      
    res.render('./clubs/musicClub.ejs',{event});
})
app.get('/socialClub',async(req,res)=>{                                                   //Hiking Club Get Route      
    res.render('./clubs/socialClub.ejs',{event});
})


app.get('/club',(req,res)=>{                                                   //Hiking Club Get Route      
    res.render('./clubs/clubLayout.ejs');
})


// EKHANE CLUBS RAKH , EI COMMENT TA DELETE KORE DISH





///////////////////////////////////////////////////   404/ERR TEMPLATE      ///////////////////////////////////////////////

// app.get("*", (req, res, next) => {                                                      //404 NOT FOUND PAGE
//     next(new ExpressError("Not Found", 404));
//   });
  
//   app.use((err, req, res, next) => {
//     const { statusCode = 500,message='Something went wrong' } = err;
//     res.status(statusCode).render("./templates/error_404.ejs", { err });
//   });




app.listen(8080,()=>{
    console.log("Server running successfully on port 8080 ....");
})