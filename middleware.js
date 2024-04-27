const express=require("express");
// const baseJoi = require("joi");


module.exports.isLoggedIn=(req,res,next)=>{
  if(!req.isAuthenticated()){
      req.session.returnTo=req.originalUrl;
      req.flash('error','You must be signed in first');
      return res.redirect('/login');
  }
  next();
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
