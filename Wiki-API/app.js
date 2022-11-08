// Require packages:
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const ejs = require("ejs");

// Init server:
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

// DB connection, Schemas and Model:
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String, 
    content: String
};

const Article = mongoose.model("Article", articleSchema);

// Routes:
// articles route
app.route("/articles")
    .get(function(req, res){   
        Article.find(function(err, foundArticles){
            if(!err){
                res.send(foundArticles);
            } else {
                res.send(err);
            };
        });
    })
    .post(function(req, res){
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function(err){
            if(!err){
                res.send("Successfully added a new article. ");
            } else {
                res.send(err);
            };
        });
    })
    .delete(function(req, res){
        Article.deleteMany(function(err){
            if(!err){
                res.send("Successfully deleted all articles. ");
            } else {
                res.send(err);
            };
        });
    });

// Specific article route
app.route("/articles/:articleTitle")
    .get(function(req, res){
        
        Article.findOne(
            {title: req.params.articleTitle},
            function(err, foundArticle){
                if(foundArticle){
                    res.send(foundArticle);
                } else {
                    res.send("No articles matching was found. ");
                };
        });
    })
    // put request update and override ALL the fields.
    .put(function(req, res){
        // Mongoose .update() method is now deprecated.
        Article.replaceOne(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            function(err){
                if(!err){
                    res.send("Successfully updated the article. ");
                };
        });
    })
    // To update just a particular field I use patch request.
    .patch(function(req, res){

        Article.findOneAndUpdate(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err){
                if(!err){
                    res.send("Successfully update the article. ");
                } else {
                    res.send(err);
                };
        });
    })
    .delete(function(req, res){

        Article.deleteOne(
            {title: req.params.articleTitle},
            function(err){
                if(!err){
                    res.send("Successfully deleted the article. ");
                } else {
                    res.send(err);
                };
        });
    });

// 
app.listen(3000, function() {
    console.log("\nServer running on port 3000.");
});