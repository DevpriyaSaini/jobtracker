const {getUser}=require("../service/auth.js");


async function restrictToLoggedinUserOnly(req, res, next) {
  try {

    const token = req.cookies?.token;
  

    if (!token) return res.redirect("/login");
    const user = getUser(token);

    if (!user) return res.redirect("/login");

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in restrictToLoggedinUserOnly middleware", error)
    return res.redirect("/login");
  }
}

async function checkAuth(req, res, next) {
  const token = req.cookies?.token;



if ( !req.cookies?.token) {
      
      return res.redirect('/login');
      return res.status(400).json({msg:"you are not login"});
      
    }

  const user  = getUser(req.cookies?.token);
 
  
  if(!user) {
    return res.redirect('/login');
  }

  req.user = user;
  next();
}

 module.exports= {
  restrictToLoggedinUserOnly,
  checkAuth,
};