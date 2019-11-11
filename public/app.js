// Dr. ScrapeLove to do:
/*  1. add functionality to load multiple notes // only previous note works
    2. create route to allow users to delete notes // only deletes the note content, not the note object
    3. add handlebars :/
    4. add validation to prohibit scraping the same articles multiple times // works, need to alert user
    5. add to portfolio
*/

// init mobile-friendly sidenav
$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.modal').modal();
});


$.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
        if (!data[i].image.includes("https://")) {
            data[i].image = 'https://freecodecamp.org' + data[i].image;
        } else {
            console.log('full image link found');
        }
        $("#articles").append("<article class='modal-trigger' data-target='modal1' data-id='" + data[i]._id + "'><img src=" + data[i].image + "><div class='clear'><p class='tag'>" + data[i].tag + "</p><h5>" + data[i].title + "</h5><br /><p>" + data[i].link + "</p></div></article>");
    }
});

$(document).on("click", "article", function () {
    $("#notes").empty();
    // Save the id
    var thisId = $(this).attr("data-id");

    // Ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .then(function (data) {
            // console.log(data);
            $("#notes").append("<h5>" + data.title + "</h5>");
            $("#notes").append("<input id='titleinput' placeholder='note title' name='title' >");
            $("#notes").append("<textarea id='bodyinput' placeholder='note body' name='body'></textarea>");
            $("#notes").append("<button class='waves-effect waves-light btn-small black white-text' data-id='" + data._id + "' id='savenote'>Save Note</button>");
            
            if (data.note) {
                // use map to display 
                $("#notes").append("<h6 class='center'>Existing Notes:</h6><hr class='hr-modal'><div id='stored-notes'></div>");
                $("#stored-notes").append(data.note.title);
                $("#stored-notes").append("<br>");
                $("#stored-notes").append(data.note.body);
                // console.log('this is data.note.id: ', data.note.id);
                $("#stored-notes").append("<br><button id='delete-note' data-id="
                    + thisId
                    + " class='waves-effect waves-light btn-small black white-text'>delete note</button><hr class='hr-modal'>")
            }
        });
});


$(document).on("click", "#savenote", function () {
    // grab the id 
    var thisId = $(this).attr("data-id");

    // POST request to change the note
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })

        .then(function (data) {
            console.log(data);
            // display feedback to the user
            $("#notes").text('note saved!');
        });

    // $("#titleinput").val("");
    // $("#bodyinput").val("");
});

// route to delete notes:
$(document).on("click", "#delete-note", function () {
    // grab the id 
    var thisId = $(this).attr("data-id");

    // which method to delete?
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })

        .then(function (data) {
            console.log(data);
            // display feedback to the user
            $("#notes").text('note deleted!');
        });
});