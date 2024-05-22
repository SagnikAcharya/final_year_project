const express=require("express");
const User=require("./models/user");
const Admin=require("./models/admin");
const Event=require("./models/events");
const Joi=require("joi")
// const baseJoi = require("joi");


module.exports.isLoggedIn=(req,res,next)=>{
  if(!req.isAuthenticated()){
    req.session.returnTo=req.originalUrl;
    req.flash('error','You must be signed in first');
    return res.redirect('/adminLogin');
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
      req.session.returnTo=req.originalUrl;
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

  module.exports.validateEvent = (req, res, next) => {
    const eventSchema = Joi.object({
        Name: Joi.string().escapeHTML().alphanum().min(3).max(30).required(),
        // password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        // email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        Description: Joi.string().required().escapeHTML().required(),
        Location: Joi.string().required().escapeHTML().required(),
        Type: Joi.string().required().escapeHTML().required(),
        EventDate:Joi.date().required(),
        moment_Date:Joi.string().required().escapeHTML().required(),
        moment_Time:Joi.string().required().escapeHTML().required(),
        deleteImages: Joi.array()
    });
    const { error } = eventSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((er) => er.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };

  module.exports.validateUser = (req, res, next) => {
    const userSchema = Joi.object({
        username: Joi.string().escapeHTML().alphanum().min(3).max(30).required(),
        password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    });
    const { error } = userSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((er) => er.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };