const express=require("express");
const User=require("./models/user");
const Admin=require("./models/admin");
// const baseJoi = require("joi");


module.exports.isLoggedIn=(req,res,next)=>{
  if(!req.isAuthenticated()){
    req.session.returnTo=req.originalUrl;
    req.flash('error','You must be signed in first');
    return res.redirect('/studentLogin');
  }
  next();
}

module.exports.isAdmin= async(req,res,next)=>{
  try{
    if(req.session.passport.user.id){
    const id=req.session.passport.user.id;
    const newadmin=await Admin.findById(id);
    const newuser=await User.findById(id)
    let news=newuser;
    if(newadmin){
      news=newadmin;
    }
    if(news.isAdmin==false){
      req.flash('error','You must be an Admin to proceed');
      req.session.returnTo=req.originalUrl;
    }
    next();
  }
  }catch(e){
    console.log(e);
    req.flash('error','You need to login first');
    res.redirect('/adminLogin');
  }
  
}

class ExpressError extends Error {
    constructor(message, statusCode) {
      super();
      this.message = message;
      this.statusCode = statusCode;
    }
  }
  
module.exports.catchAsync=function (fn){
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
  }

