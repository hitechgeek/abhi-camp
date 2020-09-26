const mongoose = require("mongoose"),
    Campground = require("./models/campground");
    Comment    = require("./models/comment");

const data=[
    {
        name:"Yosemite National Park, California",
        image:"https://i1.trekearth.com/photos/22517/yosemite_4.jpg",
        description:"Ninety-five percent of Yosemite National Park is designated wilderness, which means no cars, no buildings, and no electricity. Sleep under the stars and hike up to Glacier Point for a view of Yosemite Valley, Half Dome, and Yosemite Falls. Make sure you store your food properly though — black bears are common!"
    },
    {
        name:"Big Sur, California",
        image:"https://localadventurer.com/wp-content/uploads/2018/11/mcway-falls-big-sur-ca.jpg",
        description:"Famous around the world, Big Sur, with its wide selection of campsites, is bound to make anyone a happy camper. Pitch your tent deep among the redwoods, stream side, or right by the ocean."
    },
    {
        name:"The Isle of Arran, Scotland",
        image:"https://loveincorporated.blob.core.windows.net/contentimages/main/ef31cde5-1137-4f93-9207-a364dbcfb0f2-isle-of-arran.jpg",
        description:"Not only is the Isle of Arran beautiful, but it's also full of history — as in, it's been inhabited since prehistory. The island has a wide variety of landscapes and seascapes, including rugged mountains and rolling hills. Campers can hike, sail, kayak, or cycle around the island."
    }
];

function seedDB(){
    //remove all campgrounds
    Campground.deleteMany({},function(err)
    {
        if(err)
        {
            console.log(err);
        }
        console.log("Removed Campgrounds!!");
        Comment.deleteMany({},function(err)
        {
            if(err)
            {
                console.log(err);
            }
            console.log("Removed Comments!!");
            //add a few campgrounds
            data.forEach(function(seed)
            {
                Campground.create(seed,function(err,campground)
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        console.log("Added a Campground");
                        //create a comment
                        Comment.create(
                            {
                                text:"This Place is Great, but I wish there was Internet",
                                author:"Homer"
                            },function(err,comment)
                            {
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created New Comment");
                                }
                            }
                        );
                    }
                });
            });
        }); 
    });
}

module.exports=seedDB;