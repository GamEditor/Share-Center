$(window).on("load", function (event) {
    $("#closeMediaPlayer").on("click", function (event) {
        $("#mediaPlayer").html("<audio id='audioPlayer' controls></audio>");
        $("#mediaPlayerContainer").hide();
    });

    $("#minimizeMediaPlayer").on("click", function (event) {
        $("#mediaPlayerContainer").animate({
            left: "+=100%"
        }, 500, function () {
            $("#maximizeMediaPlayer").show();
            $("#maximizeMediaPlayer").css({ "width": $("#maximizeMediaPlayer").height() + "px" });
        });
    });

    $("#maximizeMediaPlayer").on("click", function (event) {

        $(this).hide();
        $("#mediaPlayerContainer").animate({
            left: "-=100%"
        }, 500, function () {
            // Animation complete.
        });
    });
});

function playAudio(path, type) {
    let mediaPlayerContainer = $("#mediaPlayerContainer");

    let mediaPlayer = $("#mediaPlayer");
    mediaPlayer.html("<audio id='audioPlayer' controls controlsList='nodownload'></audio>");

    mediaPlayerContainer.show();

    let audioplayer = $("#audioPlayer");
    audioplayer.attr("src", path);
    audioplayer.trigger("load");
    audioplayer.trigger("play");
}

function playVideo(path, type) {

}