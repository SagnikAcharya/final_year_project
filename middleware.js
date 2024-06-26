const express=require("express");
const User=require("./models/user");
const Admin=require("./models/admin");
const Event=require("./models/events");
const baseJoi=require("joi");
const sanitizeHtml = require('sanitize-html');
// const baseJoi = require("joi");
 
const extension = (Joi) => ({
  type: "string",
  base: Joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
            allowedTags: [],
            allowedAttributes: {},
          });
        if(clean !== value) return helpers.error('string.escapeHTML',{value})
        return clean;
      },
    },
  },
});

const Joi=baseJoi.extend(extension);

module.exports.validateEvent = (req, res, next) => {
  const eventSchema = Joi.object({
    Name: Joi.string().escapeHTML(),
    Description: Joi.string().required().escapeHTML(),
    Location: Joi.string().required().escapeHTML(),
    Type: Joi.string().required(),
    EventDate: Joi.date().required(),
    moment_Date: Joi.string().required(),
    moment_Time: Joi.string().required(),
    deleteImages: Joi.array(),
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
    username: Joi.string().min(3).max(30).required().escapeHTML(),
    about: Joi.string().escapeHTML(),
    department: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .escapeHTML(),
    mobile: Joi.number()
      .integer()
      .min(10 ** 9)
      .max(10 ** 10 - 1)
      .required(),
    experience: Joi.number()
      .integer()
      .min(0)
      .max(40)
      .required(),
    admin_id: Joi.number().integer().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .escapeHTML(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .escapeHTML(),
  });
  const { error } = userSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((er) => er.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};




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
  
 