// Require the following packages:
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();
// middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/freeCodeCampNews", { useNewUrlParser: true, useUnifiedTopology: true });

// Routes

// A GET route for scraping the freeCodeCamp news page
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.freecodecamp.org/news").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every article tag, and do the following:
    $("article").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text, href and image of every link, and save them as properties of the result object
      result.title = $(this)
        .find("h2").text().trim();
        // console.log('this is result.title: ', result.title);
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
      add concatenation in app.js for adding image url 
      */

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle.image );
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send('<p>Scrape Complete</p><a href="/"> ⬅ Back to home</a>');
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
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


// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
db.Note.create(req.body)
.then(function(dbNote){
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
})
.then(function(dbArticle) {
  // If we were able to successfully update an Article, send it back to the client
  res.json(dbArticle);
})
.catch(function(err) {
  res.json(err);
});
});


app.listen(PORT, function() {
  console.log("App running on localhost: " + PORT);
});