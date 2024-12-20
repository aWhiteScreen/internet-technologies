$(document).ready(function () {

    $("#name").on("input", function() {
        const name = $("#name").val().trim();
        if(name == "borat") {
            $('#borat').css("display", "inline");
        } else {
            $('#borat').css("display", "none");
        }
    });

    $("#comment").on("input", function() {
        const comment = $("#comment").val().trim();
        $('#preview').text(comment);
    });

    $("#submit_button").click(function(event) {
        event.preventDefault();
        const name = $("#name").val().trim();
        const founding = parseInt($("#founding").val(), 10);
        let error = false;
        if(name.length == 0) {
            alert("Name field cannot be empty");
            error = true;
        }
        if(founding <= 0 || Number.isNaN(founding)) {
            alert("Founding year must be a positive integer");
            error = true;
        }

        if (error == false) {
            const newCountry = {
                newName: name,
                newYear: founding
            };
        
            $.ajax({
                url: "https://jsonblob.com/api/jsonBlob",
                method: "POST",
                contentType: 'application/json',
                data: JSON.stringify(newCountry),
                success: function(response, status, xhr) {
                    const locationHeader = xhr.getResponseHeader('Location');
                    console.log(locationHeader);
                    const row = `<tr>
                        <td>${name}</td>
                        <td>${founding}</td>
                    </tr>`;
                    $('#countryTable tbody').append(row);
                },
                error: function(xhr, status, error) {
                    console.error("Request failed:", status, error);
                }
            });
        }
    });

    $("#load_button").click(function(event) {
        event.preventDefault();
        const url = prompt("Enter the JSONBlob URL to append data:");
        if (url) {
            $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                success: function(response) {
                    if (Array.isArray(response)) {
                        response.forEach(item => {
                            const row = `<tr>
                                <td>${item.newName}</td>
                                <td>${item.newYear}</td>
                            </tr>`;
                            $('#countryTable tbody').append(row);
                        });
                    } else {
                        const row = `<tr>
                            <td>${response.newName}</td>
                            <td>${response.newYear}</td>
                        </tr>`;
                        $("#countryTable tbody").append(row);
                    }
                },
                error: function(error) {
                    console.error("Error:", error);
                    alert("An error occurred while fetching data.");
                }
            });
        } else {
            alert("No URL provided.");
        }
    });


    $("#publish_comment").click(function(event) {
        event.preventDefault();
        const comment = $("#comment").val().trim();
        $("#comment_start").append(`<p class="last_comment">${comment}</p>`);
    });


    $("#delete_comment").click(function(event) {
        event.preventDefault();
        const comments = $('#preview_comment').length ? [$('#preview_comment')] : [];
        $('.last_comment').each(function() {
            comments.push($(this));
        });

        const count = comments.length;
        if (count == 0) {
            alert("There are no comments to delete!");
            return;
        }

        const numberToRemove = parseInt(prompt("Enter the ID of the comment you want to delete:"), 10);

        if (Number(numberToRemove) && numberToRemove >= 1 && numberToRemove <= count) {
            comments[numberToRemove - 1].remove();
            alert("Comment has been deleted");
        } else {
            alert("There is nothing to delete");
        }
    });

    $("#dark_mode").click(function() {
        $("body").css({
            "background-color": "black",
            "color": "white"
        });
    });
    $("#light_mode").click(function() {
        $("body").css({
            "background-color": "white",
            "color": "black"
        });
    });

});