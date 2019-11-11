var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// create a new ArticleSchema object
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  link: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: true  
  },

  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Article = mongoose.model("Article", ArticleSchema);


module.exports = Article;