const express    = require("express"),
      router     = express.Router(),
      passport   = require("passport"),
      User       = require("../models/user");
 
//Root Route
router.get("/",function(req,res)
{
    res.render("landing");
});

//Show register form
router.get("/register",function(req,res)
{
    res.render("register");
});

//handle signup logic
router.post("/register",function(req,res)
{
    const newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user)
    {
        if(err)
        {
            req.flash("error",err.message);
            res.render("register");
        }
        passport.authenticate("local")(req,res,function()
        {
            req.flash("success","Welcome To AbhiCamp "+ user.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login",function(req,res)
{
    res.render("login");   
});

//handling login logic
router.post("/login",passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }),function(req,res){});

//logout route
router.get("/logout",function(req,res)
{
    req.logOut();
    req.flash("success","Logged You Out");
    res.redirect("/campgrounds");
});

module.exports = router;