$(function (event) {
    // music player
    $("#closeMusicPlayer").on("click", function (event) {
        $("#musicPlayer").html("<audio id='audioPlayer' controls></audio>");
        $("#musicPlayerContainer").hide();
    });

    $("#minimizeMusicPlayer").on("click", function (event) {
        $("#musicPlayerContainer").animate({
            left: "+=100%"
        }, 500, function () {
            $("#maximizeMusicPlayer").show();
            $("#maximizeMusicPlayer").css({ "width": $("#maximizeMusicPlayer").height() + "px" });
        });
    });

    $("#maximizeMusicPlayer").on("click", function (event) {

        $(this).hide();
        $("#musicPlayerContainer").animate({
            left: "-=100%"
        }, 500, function () {
            // Animation complete.
        });
    });

    // movie player
    $("#closeMoviePlayer").on("click", function (event) {
        $("#moviePlayer").html("<video id='videoPlayer' controls controlsList='nodownload'></video>");
        $("#moviePlayerContainer").hide();
    });

    $("#minimizeMoviePlayer").on("click", function (event) {
        let moviePlayerContainer = $("#moviePlayerContainer");

        if (moviePlayerContainer.attr("data-windowState") == "max") {
            moviePlayerContainer.animate({
                width: "-=60%",
                height: "-=60%",
            }, 500, function () {
                $("#minimizeMoviePlayer").html("↨");
                moviePlayerContainer.attr("data-windowState", "min");
            });
        } else {
            moviePlayerContainer.animate({
                width: "+=60%",
                height: "+=60%",
            }, 500, function () {
                $("#minimizeMoviePlayer").html("-");
                moviePlayerContainer.attr("data-windowState", "max");
            });
        }
    });
});

function playAudio(path, fileName) {
    let musicPlayerContainer = $("#musicPlayerContainer");

    let musicPlayer = $("#musicPlayer");
    musicPlayer.html("<audio id='audioPlayer' controls controlsList='nodownload'></audio>");

    musicPlayerContainer.show();

    let audioplayer = $("#audioPlayer");
    audioplayer.attr("src", path);
    audioplayer.trigger("load");
    audioplayer.trigger("play");
}

function playVideo(path, fileName) {
    let moviePlayerContainer = $("#moviePlayerContainer");

    let moviePlayer = $("#moviePlayer");
    moviePlayer.html("<video id='videoPlayer' controls controlsList='nodownload'></video>");

    $("#movieTitle").html(fileName);

    moviePlayerContainer.show();

    let videoPlayer = $("#videoPlayer");
    videoPlayer.attr("src", path);
    videoPlayer.trigger("load");
    videoPlayer.trigger("play");
}