const express    = require("express"),
      router     = express.Router(),
      Campground = require("../models/campground"),
      middleware = require("../middleware");

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
router.post("/",middleware.isLoggedIn,function(req,res){
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
            req.flash("success","Successfully Campground Created");
            res.redirect("/campgrounds");
        }
    }); 
});

//NEW - shows form to create new campground
router.get("/new",middleware.isLoggedIn,function(req,res)
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

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res)
{
    Campground.findById(req.params.id,function(err,foundCampground)
    {
        res.render("campgrounds/edit",{campground:foundCampground});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res)
{
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground)
    {
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else
        {
            //redirect somewhere (show page)
            req.flash("success","Successfully Campground Updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });  
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res)
{
    Campground.findByIdAndRemove(req.params.id,function(err)
    {
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else
        {
            req.flash("success","Successfully Campground Destroyed");
            res.redirect("/campgrounds");
        }
    })
});

module.exports = router;