let isuploading = false;    // user can not upload another file when an upload in progress

function uploadToServer(form, progressId, refreshButton, uploadProgressDisplayer, progresstext, filestableid, loadinggifid, directoryDisplayerId, emptyFolderBackgroundId) {
    let formData = new FormData(form);
    let progressBarContainer = $(`#${progressId}`);
    let path = $(`#${refreshButton}`).attr("data-path");

    if (!isuploading) {
        if (formData.get("file").name == "")
            alert("Choose a file first!");  // if no file is selected or uploading last file is finished
        else {
            isuploading = true;

            let xhr = new XMLHttpRequest();
            xhr.open(form.method, "/?path=" + path, true);

            progressBarContainer.css("display", "block");
            uploadProgressDisplayer.style.width = 0; // reset for new uploads to better look and feel

            xhr.upload.addEventListener("progress", function (ev) {
                let progress = Math.max(ev.loaded / ev.total * 100).toFixed(0);

                if (ev.lengthComputable) {
                    uploadProgressDisplayer.style.width = progress + "%"; // showing upload progress
                    progresstext.innerHTML = progress + "%";

                    if (progress == 100) {
                        form.reset();           // reset() will empty all form information
                        isuploading = false;    // enable user to upload again
                        progressBarContainer.css("display", "none");
                        openFolder(path, refreshButton, filestableid, loadinggifid, directoryDisplayerId, emptyFolderBackgroundId); // updating list of files after upload finished
                    }
                }
                else {
                    // the length is not calcutable!
                    uploadProgressDisplayer.style.width = 0;
                    progressBarContainer.css("display", "none");
                }
            });

            xhr.send(formData);
        }
    }
    else
        alert("Another file is uploading!");  // if no file is selected or uploading last file is finished
}