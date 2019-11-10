// require node packages: 
var express = require("express");
// var exphbs  = require('express-handlebars');
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// require mongoose models
var db = require("./models");

var PORT = 3000;

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/freeCodeCampNews";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Routes================= //

// GET route for scraping the freeCodeCamp news page
app.get("/scrape", function(req, res) {
  axios.get("https://www.freecodecamp.org/news").then(function(response) {
    var $ = cheerio.load(response.data);

    // grab every article tag, and do the following:
    $("article").each(function(i, element) {
      var result = {};

      // Add the text, tag, href and image of every link, and save them as properties of the result object
      result.title = $(this)
        .find("h2").text().trim();
        result.tag = $(this)
        .find("span").text().trim();
        console.log('this is result.tag: ', result.tag);
      result.link = $(this)
        .children("a")
        .attr("href");
      result.image = $(this)
        .children("a")
        .children("img").attr("src");

      /* 
      NOTE: for images hosted on freecodecamp that are not rendered with a full (external) url i.e. '/news/authors/images/dwayne-johnson.jpg',
      there is logic included in app.js (line 16) to concatenate the missing part of the image url. 
      */

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle.image );
        })
        .catch(function(err) {
          console.log(err);
        });
    });

    // display feedback
    res.send('<p>Scrape Complete</p><a href="/"> ⬅ Back to home</a>');
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
  })
    .catch(function(error){
      res.sendStatus(500);
    })
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({_id: req.params.id})
    .populate("note")
    .then(function (dbArticle){
      res.json(dbArticle);
    })
    .catch( function(err){
      if (err) {
        res.sendStatus(500);
      }
    })
  });


// Route for saving/updating an Article's associated Note NEED TO UPDATE LOGIC FOR MANY NOTES
app.post("/articles/:id", function(req, res) {
db.Note.create(req.body)
.then(function(dbNote){
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
})
.then(function(dbArticle) {
  res.json(dbArticle);
})
.catch(function(err) {
  res.json(err);
});
});


app.listen(PORT, function() {
  console.log("App running on localhost: " + PORT);
});
