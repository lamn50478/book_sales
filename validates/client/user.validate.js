module.exports.registerPost=(req,res,next)=>{

  if(!req.body.email){
     req.flash("error","Vui lòng nhập email");
      res.redirect( "/user/register");
      return;
  }
  
  if(!req.body.fullName){
     req.flash("error","Vui lòng nhập ten");
      res.redirect( "/user/register");
      return;
  }
    if(!req.body.password){
     req.flash("error","Vui lòng nhập password");
      res.redirect( "/user/register");
      return;
  }
  next();
}
module.exports.loginPost=(req,res,next)=>{

  if(!req.body.email){
     req.flash("error","Vui lòng nhập email");
      res.redirect( "/user/login");
      return;
  }
  
  
    if(!req.body.password){
     req.flash("error","Vui lòng nhập password");
      res.redirect( "/user/login");
      return;
  }
  next();
}
module.exports.forgetPassPost=(req,res,next)=>{

  if(!req.body.email){
     req.flash("error","Vui lòng nhập email");
      res.redirect( "/user/password/forget");
      return;
  }
  
  
   
  next();
}

module.exports.confirmPassword=(req,res,next)=>{

  if(!req.body.password){
     req.flash("error","Vui lòng nhập mat khau");
      res.redirect( "/user/password/reset");
      return;
  }
  
  if(!req.body.resetPassword){
     req.flash("error","Vui lòng nhập xac nhan mat khau");
      res.redirect( "/user/password/reset");
      return;
  }
  
  if(req.body.password!=req.body.resetPassword){
     req.flash("error","Nhap mat khau khong trung khop!");
      res.redirect( "/user/password/reset");
      return;
  }
  
  
  
   
  next();
}
