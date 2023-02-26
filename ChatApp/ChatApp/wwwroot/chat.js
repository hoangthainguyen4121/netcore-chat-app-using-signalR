
$(function () {
    // Get the message query parameter from the URL
    var message = getQueryParameter("msg");

    // Set the username from the cookie
    var username = getCookie("username");
    if (!username) {
        // If the username cookie does not exist, show the username modal
        $("#usernameModal").show();
        $("#usernameButton").click(function () {
            // Set the username cookie when the OK button is clicked
            var usernameInput = $("#usernameInput").val();
            if (usernameInput) {
                setCookie("username", usernameInput, 365);
                username = usernameInput;
                $("#usernameModal").hide();
            }
        });
    }

    // Set up SignalR hub connection
    var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

    connection.on("ReceiveMessage", function (user, message) {
        // Add the message to the messages list
        var encodedUser = $("<div />").text(user).html();
        var encodedMsg = $("<div />").text(message).html();
        $("#messagesList").append("<li><strong>" + encodedUser + "</strong>: " + encodedMsg + "</li>");
    });

    // Start the connection
    connection.start().then(function () {
        if (message) {
            // If a message was specified in the query parameter, send it to the hub
            connection.invoke("SendMessage", username, message);
        }
    }).catch(function (err) {
        return console.error(err.toString());
    });

    // Handle the send button click event
    $("#sendButton").click(function () {
        var messageInput = $("#messageInput");
        var message = messageInput.val();
        if (message) {
            connection.invoke("SendMessage", username, message);
            messageInput.val("");
        }
    });
});

// Helper functions for working with cookies and query parameters
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function getQueryParameter(name) {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    return urlParams.get(name);
}