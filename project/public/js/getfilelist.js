/**
 * request files
 * @param filesContainerId the place of showing files at innerHTML.
 * @param loadingGifId until waiting for response from server, this (gif) image will be displayed.
 * @param directoryDisplayerId a container for showing current path
 * @param emptyFolderBackgroundId if a folder is empty, then a background will be displayed
 */
function openFolder(path, refreshButtonId, filesContainerId, loadingGifId, directoryDisplayerId, emptyFolderBackgroundId) {
    const emptyFolderBackground = document.getElementById(emptyFolderBackgroundId);
    const filesholder = document.getElementById(filesContainerId);
    const loadinggif = document.getElementById(loadingGifId);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState < 4) {
            filesholder.innerHTML = '';
            emptyFolderBackground.style.display = 'none';
            loadinggif.style.display = 'block';
        }

        if (this.readyState == 4 && this.status == 200) {
            const response = JSON.parse(this.responseText); // convert server response to object
            let files = '';

            // checking empty response
            if (response.length == 1 && !response[0].name) {
                emptyFolderBackground.style.display = 'block';
                loadinggif.style.display = "none";
            } else if (response.length > 0) {
                emptyFolderBackground.style.display = 'none';

                // creating files elements on an string
                for (let i = 0; i < response.length; i++) {
                    files +=
                        '<div class="file" id="file-' + i + '" title="Size: ' + response[i].size + '\nUpload Date: ' + new Date(response[i].uploadDate) + '">\
                    <div class="' + response[i].extension + ' unknownExtension"></div><div>' + response[i].name + '</div></div>';
                }

                filesholder.innerHTML = files;      // attaching created elements to dom

                loadinggif.style.display = "none";  // hiding loading gif

                // adding custom attributes to elements
                for (let i = 0; i < response.length; i++) {
                    let file = $("#file-" + i);

                    file.attr("data-type", response[i].filetype);
                    file.attr("data-extension", response[i].extension);
                    file.attr("data-path", encodeURI(response[i].path + '/' + response[i].name));

                    if (file.attr("data-type") == "file") {
                        file.on("dblclick", function (ev) {
                            openFile(file.attr("data-extension"), file.attr("data-path"));
                        });
                    }
                    else {
                        file.on("dblclick", function (ev) {
                            openFolder(file.attr("data-path"), refreshButtonId, filesContainerId, loadingGifId, directoryDisplayerId, emptyFolderBackgroundId);
                        });
                    }
                }
            } else {
                loadinggif.style.display = "none";  // hiding loading gif
            }

            // showing directory on ui
            makeDirectoryElements(response[0].path, refreshButtonId, filesContainerId, loadingGifId, directoryDisplayerId, emptyFolderBackgroundId);
        }
    };

    // sending get files request to server
    xhr.open("GET", "files-list?path=" + path, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send();
}

function makeDirectoryElements(path, refreshButtonId, filesContainerId, loadingGifId, directoryDisplayerId, emptyFolderBackgroundId) {
    var directoryDisplayer = document.getElementById(directoryDisplayerId);
    const refreshButton = document.getElementById(refreshButtonId);

    var folders = path.split('/');
    var result = '';

    for (let i = 0; i < folders.length; i++) {
        result += '<span id="dir-' + i + '" class="directory">' + folders[i] + '</span>/';
    }

    directoryDisplayer.innerHTML = result.substring(0, result.length - 1);

    // when click on directory name, that previous folder will be open
    // if last directory (current opened folder) so hasn't onclick listener
    for (let i = 0; i < folders.length - 1; i++) {
        let dir = $("#dir-" + i);

        // let dir = document.getElementById('dir-' + i);
        // let pathAttribute = document.createAttribute('path');

        let path = '';
        for (let j = 0; j <= i; j++)
            path += folders[j] + '/';

        dir.attr("data-path", encodeURI(path.substring(0, path.length - 1)));

        // pathAttribute.value = encodeURI(path.substring(0, path.length - 1));

        // dir.setAttributeNode(pathAttribute);

        dir.on("click", function (event) {
            openFolder($(this).attr("data-path"), refreshButtonId, filesContainerId, loadingGifId, directoryDisplayerId, emptyFolderBackgroundId);
        });
    }

    refreshButton.setAttribute('path', path);
}

function openFile(extension, path) {
    switch (extension) {
        /* musics: */
        case "mp3":
        case "wav":
            playAudio(path);
            break;

        /* movies */
        case "mp4":
        case "webm":
            playVideo(path);
            break;

        default:
            window.open(path);
    }
}