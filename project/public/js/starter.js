const uploadbuttonId = 'uploadbutton';
const fileuploaderId = 'fileuploader';
const progressId = 'progress';
const refreshButtonId = 'refreshButton';
const filesContainerId = 'fileholder';
const loadingGifId = 'loadinggif';
const directoryDisplayerId = 'directoryDisplayer';
const emptyFolderBackgroundId = 'emptyFolderBackground';

window.onload = function () {
    if (isInternetExplorer()) {
        document.getElementById(fileuploaderId).innerHTML = '<span class="alertmessage">Internet Explorer doesn\'t support the most functionalities!</span>';
        document.getElementById(progressId).outerHTML = '';
    }
    else {
        document.getElementById(progressId).style.display = 'none';
    }

    // initialize ui buttons
    // initUploadbutton();
    initRefreshButton();

    openFolder('files', refreshButtonId, filesContainerId, loadingGifId, directoryDisplayerId, emptyFolderBackgroundId)
}

function isInternetExplorer() {
    if (window.navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
        return true;
    else
        return false;
}

function initRefreshButton() {
    const refreshButton = $(`#${refreshButtonId}`);
    refreshButton.attr('data-path', 'files');

    refreshButton.on("click", function (ev) {
        openFolder($(this).attr('data-path'), refreshButtonId, filesContainerId, loadingGifId, directoryDisplayerId, emptyFolderBackgroundId);
    });
}

function initUploadbutton() {
    document.getElementById(uploadbuttonId).addEventListener('click', function (ev) {
        uploadToServer(
            document.getElementById('form_fileUpload'),
            refreshButtonId,
            document.getElementById('progressBar'),
            document.getElementById('progress-percentage'),
            filesContainerId,
            loadingGifId,
            directoryDisplayerId,
            emptyFolderBackgroundId);
    });
}