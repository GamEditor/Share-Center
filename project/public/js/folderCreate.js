function createnewfolder(path) {
    $.ajax({
        url: `/?newfolder=${path}`,
        method: "PUT",
        success: function (data) { $(`#${refreshButtonId}`).trigger("click"); },
        error: function (error) { console.log(error); }
    });
}