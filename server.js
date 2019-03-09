var express = require("express");
var app = express();
var path = require('path');
var friendsList = require("./app/data/friends")

var PORT = process.env.PORT || 8080;

// Parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.get("/survey", function (req, res) {
    res.sendFile(path.join(__dirname, "app/public/survey.html"));
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "app/public/home.html"));
});

app.get("/api/friends", function (req, res) {
    return res.json(friendsList.friends);
});

app.post("/api/friends", function (req, res) {
    //handle incoming surver results
    var newFriend = req.body;
    //compatability logic
    console.log(newFriend)
    friendsList.friends.push(newFriend);
    var lowestScore = 100;
    var newBestFriendName;
    var newBestFriendPic;
    for (i = 0; i < friendsList.friends.length - 1; i++) {
        var totalDifference = 0;
        for (j = 0; j < friendsList.friends[i].scores.length; j++) {
            var compareTo = friendsList.friends.length - 1;
            var newestMember = friendsList.friends[compareTo]
            totalDifference = totalDifference +  Math.abs(friendsList.friends[i].scores[j] - newestMember.scores[j]);
            // console.log("total difference: " + totalDifference);
        }
        if (totalDifference < lowestScore) {
            newBestFriendName = friendsList.friends[i].name;
            newBestFriendPic = friendsList.friends[i].photo;
            lowestScore = totalDifference;
            console.log("Lowest score: " + lowestScore + " points from " + newBestFriendName)

        } else {
            console.log(friendsList.friends[i].name + " is not a good match.")
        }
    }
    
    console.log("Your score was " + totalDifference + " points from " + newBestFriendName)
    res.json({
        newFriend: newBestFriendName,
        newFriendPic: newBestFriendPic
    })

})

app.listen(PORT, function () {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});