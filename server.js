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

    // Now, we grab every h2 within an article tag, and do the following:
    $("article").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text, href and image of every link, and save them as properties of the result object
      result.title = $(this)
        .children(".post-card-title")
        .children("h2").text();
      result.link = $(this)
        .children("a")
        .attr("href");
      result.image = $(this)
        .children("a")
        .children("img").attr("src")
        // .first().attr("src")   // .find("img")  or .children("img") ?
        // .attr("src");

      /* 
      add concatenation in app.js for adding image url 
      */

        console.log('result', result.title);
        // console.log(result.image); this is undefined
      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
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
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included

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
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
db.Note.create(req.body)
.then(function(dbNote){
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
})
.then(function(dbArticle) {
  // If we were able to successfully update an Article, send it back to the client
  res.json(dbArticle);
})
.catch(function(err) {
  // If an error occurred, send it to the client
  res.json(err);
});
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

