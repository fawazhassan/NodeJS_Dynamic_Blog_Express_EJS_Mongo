var express = require('express'),
    methodOverride = require("method-override"),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');


//APP CONFIG   
mongoose.connect('mongodb://localhost:27017/restful_blog_app', { useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: { type: String, default: "https://www.hsjaa.com/images/joomlart/demo/default.jpg" },
    body: String,
    created: { type: Date, default: Date.now }
});

var BlogPost = mongoose.model("BlogPost", blogSchema);

// BlogPost.create({
//     title: "How to make a Blog Site",
//     body: "dsrfsrtgdtyhtdyhdhrsth"

// },function(err, result){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("BlogPost Object Added");
//         console.log(result);
//     }

// });


//RESTFUL ROUTES
app.get("/", function(req, res) {
    res.redirect("/blog");
});


//INDEX ROUTE
app.get("/blog", function(req, res) {

    BlogPost.find({}, function(err, blogPosts) {
        if (err) {
            console.log(err);
        }
        else {

            res.render("blog_index", { blogPosts: blogPosts });

        }

    });
});

//NEW ROUTE
app.get("/blog/new", function(req, res) {

    res.render("blog_new");

});

//CREATE ROUTE

app.post("/blog", function(req, res) {
    //create blog
    BlogPost.create(req.body.blog, function(err, newBlogPost) {
        if (err) {
            console.log(err);
            res.render("blog_new");
        }
        else {

            console.log("New Post Created:");
            console.log(newBlogPost);

//redirect to blog index
            res.redirect("/blog");
        }
    });
});



//SHOW ROUTE
app.get("/blog/:id", function(req, res){
    
BlogPost.findById(req.params.id, function(err, selectedBlog){
    if (err){
        res.redirect("/blog");
    }
    else{
        
        res.render("blog_show", {blogPost: selectedBlog});
        
    }
    });    
});


//EDIT ROUTE


app.get("/blog/:id/edit", function(req, res){

BlogPost.findById(req.params.id,function(err, selectedBlog){
    if(err){
        res.rediredt("/blogs");
    }
    else{
    res.render("blog_edit", {blogPost: selectedBlog});
    }
    
    
});
    
});

//UPDATE ROUTE
app.put("/blog/:id", function(req, res){

    BlogPost.findByIdAndUpdate(req.params.id, req.body.blog,function(err, updatedBlog){
        if(err){
            res.redirect("/blog");
        }
        else{
            res.redirect("/blog/" + req.params.id);
            
        }
        
        
    });
    
});


app.listen(process.env.PORT, process.env.IP, function() {

    console.log("Server has initialised");

});
