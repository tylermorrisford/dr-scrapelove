// Dr. ScrapeLove to do
/*  1. add photo from article -- started - need help
    2. add functionality to load multiple notes // previous note works
    3. finish styling -- started
    4. add email yourself a link functionality, probably in the server...?

    QUESTIONS: 
    1. what is morgan? 
    2.
*/

// init sidenav
$(document).ready(function(){
    $('.sidenav').sidenav();
    $('.modal').modal();
  });


// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the article; add class and data-target for notes modal
      $("#articles").append("<article class='modal-trigger' data-target='modal1' data-id='" + data[i]._id + "'><img src=" + data[i].image + "><h5>" + data[i].title + "</h5><br /><p>" + data[i].link + "</p></article>");
    }
  });
  // https://www.freecodecamp.org/news/learn-python-by-building-5-games/
  $(document).on("click", "article", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h5>" + data.title + "</h5>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' placeholder='note title' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' placeholder='note body' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button class='waves-effect waves-light btn-small black white-text' data-id='" + data._id + "' id='savenote'>Save Note</button>");
        $("#notes").append("<h6 class='center'>Existing Notes:</h6><hr class='hr-modal'><div id='stored-notes'></div>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          // need for loop?
        //   $("#stored-notes").val(data.note.title);
          $("#stored-notes").append(data.note.title);
          $("#stored-notes").append("<br>");
          // Place the body of the note in the body textarea
        //   $("#stored-notes").val(data.note.body);
          $("#stored-notes").append(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
