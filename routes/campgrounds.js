const express    = require("express"),
      router     = express.Router(),
      Campground = require("../models/campground");

//INDEX - shows all campgrounds
router.get("/",function(req,res)
{
    //Get all campgrounds from db
    Campground.find({},function(err,allcampgrounds)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("campgrounds/index",{campgrounds:allcampgrounds,currentUser:req.user});
        }
    });
    
});

//CREATE - add new campgrounds to db
router.post("/",isLoggedIn,function(req,res){
    //get data from form and add to campgrounds array
    const name=req.body.name;
    const image=req.body.image;
    const desc=req.body.description;
    const author={
        id:req.user._id,
        username:req.user.username
    };
    const newCampground={name:name,image:image,description:desc,author:author};
    //Create a new campground and save to db
    Campground.create(newCampground,function(err,newlyCreated)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    }); 
});

//NEW - shows form to create new campground
router.get("/new",isLoggedIn,function(req,res)
{
    res.render("campgrounds/new");
});

//SHOW - shows more info about one campground
router.get("/:id",function(req,res)
{
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });  
});

//Middleware
function isLoggedIn(req,res,next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
